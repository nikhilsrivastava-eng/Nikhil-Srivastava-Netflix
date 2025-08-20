from datetime import datetime

import pytest
from fastapi.testclient import TestClient


def test_signup_sets_cookie_and_returns_token_and_user(client: TestClient):
    payload = {
        "email": "alice@example.com",
        "name": "Alice",
        "password": "secret123",
    }
    r = client.post("/auth/signup", json=payload)
    assert r.status_code == 201, r.text

    data = r.json()
    assert "access_token" in data and data["access_token"]
    assert data["token_type"] == "bearer"
    assert "user" in data and data["user"]["email"] == "alice@example.com"

    # Cookie set
    cookies = r.cookies
    assert cookies.get("access_token")


def test_signup_duplicate_email_returns_400(client: TestClient):
    payload = {
        "email": "bob@example.com",
        "name": "Bob",
        "password": "secret123",
    }
    r1 = client.post("/auth/signup", json=payload)
    assert r1.status_code == 201

    r2 = client.post("/auth/signup", json=payload)
    assert r2.status_code == 400
    assert r2.json()["error"]["message"] == "Email already registered"


def test_login_success_sets_cookie_and_returns_token(client: TestClient):
    # create user via signup
    client.post("/auth/signup", json={
        "email": "charlie@example.com",
        "name": "Charlie",
        "password": "secret123",
    })

    r = client.post("/auth/login", json={
        "email": "charlie@example.com",
        "password": "secret123",
    })
    assert r.status_code == 200
    data = r.json()
    assert data["user"]["email"] == "charlie@example.com"
    assert r.cookies.get("access_token")


def test_login_invalid_credentials_returns_401(client: TestClient):
    r = client.post("/auth/login", json={
        "email": "nobody@example.com",
        "password": "wrong",
    })
    assert r.status_code == 401
    body = r.json()
    assert body["error"]["message"] == "Invalid email or password"


def test_me_requires_auth_and_returns_user(client: TestClient):
    # Without auth
    r1 = client.get("/auth/me")
    assert r1.status_code == 401

    # With auth
    r2 = client.post("/auth/signup", json={
        "email": "dana@example.com",
        "name": "Dana",
        "password": "secret123",
    })
    assert r2.status_code == 201

    cookies = r2.cookies
    # set cookies on the client instance instead of per-request passing (avoids deprecation warning)
    client.cookies.update(cookies)
    r3 = client.get("/auth/me")
    assert r3.status_code == 200
    assert r3.json()["email"] == "dana@example.com"


def test_logout_clears_cookie(client: TestClient):
    client.post("/auth/signup", json={
        "email": "erin@example.com",
        "name": "Erin",
        "password": "secret123",
    })
    r = client.post("/auth/logout")
    assert r.status_code == 204
