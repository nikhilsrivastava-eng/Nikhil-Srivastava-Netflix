from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from server.db import get_db
from server.security import get_current_user
from server.models.user import User
from server.schema.movie import MovieCreate, MovieOut, MovieUpdate, UpdateMovieResponse
from server.usecases.movies import create_movie, update_movie, MovieTitleTaken

router = APIRouter(prefix="/movies", tags=["movies"])


def _ensure_admin(user: User):
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")


@router.post("", response_model=MovieOut, status_code=status.HTTP_201_CREATED)
def create_movie_api(
    payload: MovieCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_admin(current_user)
    try:
        movie = create_movie(db, data=payload.model_dump(exclude_unset=True))
    except MovieTitleTaken:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Movie title already exists")
    return MovieOut.model_validate(movie)


@router.put("/{movie_id}", response_model=UpdateMovieResponse)
def update_movie_api(
    movie_id: int,
    payload: MovieUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _ensure_admin(current_user)
    try:
        movie = update_movie(db, movie_id=movie_id, data=payload.model_dump(exclude_unset=True))
    except ValueError as e:
        if str(e) == "NOT_FOUND":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
        raise
    except MovieTitleTaken:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Movie title already exists")

    return UpdateMovieResponse(movie=MovieOut.model_validate(movie))
