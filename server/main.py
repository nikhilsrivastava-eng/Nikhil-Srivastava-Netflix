import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError

from server.db import Base, engine, get_db
from server.routes import auth as auth_routes
from server.routes import movies as movies_routes

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Import models so they are registered with SQLAlchemy's metadata
    from server.models import user  # noqa: F401
    from server.models import movie  # noqa: F401

    # Create tables
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Netflix Clone API", version="0.1.0", lifespan=lifespan)

# Minimal CORS setup (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Netflix Clone FastAPI server is running"}


# -----------------------------
# Centralized Error Handling
# -----------------------------
logger = logging.getLogger("uvicorn.error")


def _error_payload(request: Request, status_code: int, message: str, code: str | None = None):
    return {
        "error": {
            "message": message,
            "code": code or str(status_code),
        },
        "path": request.url.path,
    }


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(status_code=exc.status_code, content=_error_payload(request, exc.status_code, exc.detail))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    content = _error_payload(request, 422, "Validation error")
    content["details"] = exc.errors()
    return JSONResponse(status_code=422, content=content)


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.exception("Database error: %s", exc)
    return JSONResponse(status_code=500, content=_error_payload(request, 500, "Internal database error", code="DB_ERROR"))


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(status_code=500, content=_error_payload(request, 500, "Internal server error", code="INTERNAL_ERROR"))


# Routers
app.include_router(auth_routes.router)
app.include_router(movies_routes.router)
