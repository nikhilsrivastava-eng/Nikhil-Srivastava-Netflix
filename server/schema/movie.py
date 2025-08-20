from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field
from server.models.movie import MovieGenre


class MovieBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    genre: MovieGenre = Field(..., description="Movie genre enum")
    release_year: Optional[int] = Field(None, ge=1888, le=2100)
    duration: Optional[int] = Field(None, ge=1, description="Duration in minutes")
    rating: Optional[float] = Field(None, ge=0, le=5)
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    trailer_url: Optional[str] = None
    is_premium: Optional[bool] = False


class MovieCreate(MovieBase):
    pass


class MovieUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    genre: Optional[MovieGenre] = None
    release_year: Optional[int] = Field(None, ge=1888, le=2100)
    duration: Optional[int] = Field(None, ge=1)
    rating: Optional[float] = Field(None, ge=0, le=5)
    video_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    trailer_url: Optional[str] = None
    is_premium: Optional[bool] = None


class MovieOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    genre: str
    release_year: Optional[int]
    duration: Optional[int]
    rating: Optional[float]
    video_url: Optional[str]
    thumbnail_url: Optional[str]
    trailer_url: Optional[str]
    is_premium: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UpdateMovieResponse(BaseModel):
    message: str = "Movie updated successfully"
    movie: MovieOut
