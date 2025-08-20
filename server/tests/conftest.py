import os
import tempfile
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.main import app
from server.db import Base, get_db
from server import models as _models_pkg  # noqa: F401
from server.models import user as _user_model  # noqa: F401
from server.models import movie as _movie_model  # noqa: F401


@pytest.fixture(scope="session")
def db_engine():
    # Use a temporary SQLite file to persist across connections
    tmp = tempfile.NamedTemporaryFile(suffix=".db", delete=False)
    tmp.close()
    engine = create_engine(f"sqlite:///{tmp.name}", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    try:
        yield engine
    finally:
        # Cleanup file
        try:
            os.remove(tmp.name)
        except FileNotFoundError:
            pass


@pytest.fixture()
def db_session(db_engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client(db_engine):
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=db_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    # Override app dependency
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
