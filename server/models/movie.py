from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, Numeric, CheckConstraint, UniqueConstraint, func
from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column

from server.db import Base


class MovieGenre(str, PyEnum):
    Action = "Action"
    Drama = "Drama"
    Comedy = "Comedy"
    Thriller = "Thriller"
    Horror = "Horror"
    SciFi = "Sci-Fi"
    Romance = "Romance"
    Documentary = "Documentary"
    Animation = "Animation"
    Adventure = "Adventure"
    Fantasy = "Fantasy"
    Crime = "Crime"
    Mystery = "Mystery"
    Family = "Family"


class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    genre: Mapped[MovieGenre] = mapped_column(SAEnum(MovieGenre, name="genre_enum"), nullable=False, index=True)
    release_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration: Mapped[int | None] = mapped_column(Integer, nullable=True)  # minutes
    rating: Mapped[float | None] = mapped_column(Numeric(2, 1), nullable=True)
    video_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    thumbnail_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    trailer_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_premium: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="0")

    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    __table_args__ = (
        CheckConstraint("rating IS NULL OR (rating >= 0 AND rating <= 5)", name="ck_movies_rating_range"),
        UniqueConstraint("title", name="uq_movies_title"),
    )
