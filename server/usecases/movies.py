from typing import Optional, Dict, Any
from sqlalchemy.orm import Session

from server.models.movie import Movie


class MovieTitleTaken(Exception):
    pass


def create_movie(db: Session, *, data: Dict[str, Any]) -> Movie:
    # Business rules: unique title
    existing = db.query(Movie).filter(Movie.title == data.get("title")).first()
    if existing:
        raise MovieTitleTaken()

    movie = Movie(
        title=data["title"],
        description=data.get("description"),
        genre=data["genre"],
        release_year=data.get("release_year"),
        duration=data.get("duration"),
        rating=data.get("rating"),
        video_url=data.get("video_url"),
        thumbnail_url=data.get("thumbnail_url"),
        trailer_url=data.get("trailer_url"),
        is_premium=bool(data.get("is_premium", False)),
    )
    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie


def get_movie(db: Session, *, movie_id: int) -> Movie:
    """
    Retrieve a single movie by id.

    Business rules:
    - If not found, raise ValueError("NOT_FOUND") to let route map to 404.
    """
    movie: Optional[Movie] = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise ValueError("NOT_FOUND")
    return movie


def update_movie(db: Session, *, movie_id: int, data: Dict[str, Any]) -> Movie:
    movie: Optional[Movie] = db.query(Movie).filter(Movie.id == movie_id).first()
    if not movie:
        raise ValueError("NOT_FOUND")

    # If title provided, ensure uniqueness
    new_title = data.get("title")
    if new_title and new_title != movie.title:
        exists = db.query(Movie).filter(Movie.title == new_title).first()
        if exists:
            raise MovieTitleTaken()

    # Patch fields
    for field in (
        "title",
        "description",
        "genre",
        "release_year",
        "duration",
        "rating",
        "video_url",
        "thumbnail_url",
        "trailer_url",
        "is_premium",
    ):
        if field in data and data[field] is not None:
            setattr(movie, field, data[field])

    db.add(movie)
    db.commit()
    db.refresh(movie)
    return movie
