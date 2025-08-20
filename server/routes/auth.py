from datetime import datetime, UTC
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from server.db import get_db
from server.schema.user import UserCreate, UserOut
from server.schema.auth import LoginRequest, AuthResponse
from server.usecases.auth import signup_user, login_user
from server.security import set_auth_cookie, clear_auth_cookie, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate, response: Response, db: Session = Depends(get_db)):
    try:
        user, token = signup_user(
            db,
            email=payload.email,
            name=payload.name,
            password=payload.password,
            profile_picture=payload.profile_picture,
        )
    except ValueError as e:
        if str(e) == "EMAIL_TAKEN":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        raise

    set_auth_cookie(response, token)
    return AuthResponse(
        access_token=token,
        user=UserOut.model_validate(user),
        issued_at=datetime.now(UTC),
        message="Account created successfully",
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    try:
        user, token = login_user(db, email=payload.email, password=payload.password)
    except ValueError as e:
        if str(e) == "INVALID_CREDENTIALS":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        raise

    set_auth_cookie(response, token)
    return AuthResponse(
        access_token=token,
        user=UserOut.model_validate(user),
        issued_at=datetime.now(UTC),
        message="Signed in successfully",
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response):
    clear_auth_cookie(response)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/me", response_model=UserOut)
def me(current_user = Depends(get_current_user)):
    return current_user
