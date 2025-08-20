import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from server.models.user import User
from server.models.movie import Movie, MovieGenre
from server.security import create_access_token, hash_password, COOKIE_NAME


def make_user(db: Session, *, email: str, name: str, role: str = "user") -> User:
    user = User(email=email, name=name, password_hash=hash_password("password"), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def auth_client_for_user(client: TestClient, user: User) -> TestClient:
    token = create_access_token(subject=str(user.id))
    client.cookies.set(COOKIE_NAME, token)
    return client


def test_create_movie_success(client: TestClient, db_session: Session):
    admin = make_user(db_session, email="admin@example.com", name="Admin", role="admin")
    auth_client_for_user(client, admin)

    payload = {
        "title": "Inception",
        "description": "A mind-bending thriller",
        "genre": "Action",
        "release_year": 2010,
        "duration": 148,
        "is_premium": False,
    }

    res = client.post("/movies", json=payload)
    assert res.status_code == 201, res.text
    data = res.json()
    assert data["id"] > 0
    assert data["title"] == "Inception"
    assert data["genre"] == "Action"


def test_create_movie_conflict_title(client: TestClient, db_session: Session):
    admin = make_user(db_session, email="admin2@example.com", name="Admin2", role="admin")
    auth_client_for_user(client, admin)

    payload = {
        "title": "Duplicate",
        "genre": "Drama",
    }
    res1 = client.post("/movies", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/movies", json=payload)
    assert res2.status_code == 409


def test_create_movie_unauthenticated(client: TestClient):
    # ensure no auth cookie
    client.cookies.clear()
    res = client.post("/movies", json={"title": "X", "genre": "Comedy"})
    assert res.status_code == 401


def test_create_movie_forbidden_for_user_role(client: TestClient, db_session: Session):
    user = make_user(db_session, email="user@example.com", name="User", role="user")
    auth_client_for_user(client, user)
    res = client.post("/movies", json={"title": "Y", "genre": "Comedy"})
    assert res.status_code == 403


def test_update_movie_success(client: TestClient, db_session: Session):
    admin = make_user(db_session, email="admin3@example.com", name="Admin3", role="admin")
    auth_client_for_user(client, admin)

    # create a movie first
    res_create = client.post("/movies", json={"title": "Old Title", "genre": "Horror"})
    assert res_create.status_code == 201
    movie_id = res_create.json()["id"]

    res_update = client.put(f"/movies/{movie_id}", json={"title": "New Title", "genre": "Thriller"})
    assert res_update.status_code == 200
    data = res_update.json()
    assert data["message"] == "Movie updated successfully"
    assert data["movie"]["title"] == "New Title"
    assert data["movie"]["genre"] == "Thriller"


def test_update_movie_not_found(client: TestClient, db_session: Session):
    admin = make_user(db_session, email="admin4@example.com", name="Admin4", role="admin")
    auth_client_for_user(client, admin)
    res = client.put("/movies/999999", json={"title": "Does Not Matter"})
    assert res.status_code == 404


def test_update_movie_title_conflict(client: TestClient, db_session: Session):
    admin = make_user(db_session, email="admin5@example.com", name="Admin5", role="admin")
    auth_client_for_user(client, admin)

    # create two movies
    r1 = client.post("/movies", json={"title": "A", "genre": "Action"})
    r2 = client.post("/movies", json={"title": "B", "genre": "Drama"})
    assert r1.status_code == 201 and r2.status_code == 201

    id_b = r2.json()["id"]
    # attempt to rename B to A -> conflict
    r_update = client.put(f"/movies/{id_b}", json={"title": "A"})
    assert r_update.status_code == 409
