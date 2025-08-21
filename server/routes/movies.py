from datetime import datetime
from typing import Any

import os
import tempfile
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status, Query
from sqlalchemy.orm import Session

from server.db import get_db
from server.security import get_current_user
from server.models.user import User
from server.models.movie import Movie, MovieGenre
from server.schema.movie import (
    MovieCreate,
    MovieOut,
    MovieUpdate,
    UpdateMovieResponse,
    MovieVideoUploadResponse,
)
from server.usecases.movies import create_movie, update_movie, get_movie, MovieTitleTaken
from server.services.hls_transcoder import transcode_to_hls, FFmpegNotFound
from server.services.cloudinary_uploader import upload_files_as_raw, raw_url_for
import cloudinary.uploader

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


@router.get("", response_model=list[MovieOut])
def list_movies_api(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    q: str | None = Query(None, min_length=1, max_length=255, description="Search by title"),
    genre: MovieGenre | None = Query(None, description="Filter by genre"),
    is_premium: bool | None = Query(None, description="Filter by premium flag"),
    limit: int = Query(20, ge=1, le=100, description="Page size (max 100)"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    order: str = Query("newest", description="Sort order: newest|oldest|rating_desc|rating_asc"),
):
    """
    List movies.

    Security: Authenticated users. Admin not required.
    """
    query = db.query(Movie)

    # Filters
    if q:
        query = query.filter(Movie.title.ilike(f"%{q}%"))
    if genre is not None:
        query = query.filter(Movie.genre == genre)
    if is_premium is not None:
        query = query.filter(Movie.is_premium == is_premium)

    # Ordering
    if order == "oldest":
        query = query.order_by(Movie.created_at.asc())
    elif order == "rating_desc":
        query = query.order_by(Movie.rating.desc().nullslast())
    elif order == "rating_asc":
        query = query.order_by(Movie.rating.asc().nullsfirst())
    else:
        query = query.order_by(Movie.created_at.desc())

    movies = query.offset(offset).limit(limit).all()
    return [MovieOut.model_validate(m) for m in movies]


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


@router.post("/{movie_id}/upload-trailer", response_model=UpdateMovieResponse)
def upload_movie_trailer_api(
    movie_id: int,
    file: UploadFile = File(..., description="Trailer video file to upload"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a trailer video to Cloudinary and update the movie's trailer_url.

    Security: Admin-only.
    """
    _ensure_admin(current_user)

    if not file.content_type or not file.content_type.startswith("video/"):
        raise HTTPException(status_code=400, detail="Invalid trailer file type")

    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    if not cloud_name or not os.getenv("CLOUDINARY_API_KEY") or not os.getenv("CLOUDINARY_API_SECRET"):
        raise HTTPException(status_code=500, detail="Cloudinary is not configured on the server")

    with tempfile.TemporaryDirectory(prefix="upload_trailer_") as tmpdir:
        tmp_path = Path(tmpdir) / file.filename
        try:
            with tmp_path.open("wb") as f:
                f.write(file.file.read())
        finally:
            file.file.close()

        folder = f"movies/{movie_id}/trailers"
        public_basename = Path(file.filename).stem
        try:
            res = cloudinary.uploader.upload(
                str(tmp_path),
                resource_type="video",
                folder=folder,
                public_id=public_basename,
                overwrite=True,
            )
        except Exception:
            raise HTTPException(status_code=502, detail="Failed to upload trailer to Cloudinary")

    url = res.get("secure_url") or res.get("url")
    if not url:
        raise HTTPException(status_code=502, detail="Cloudinary did not return a URL for trailer")

    try:
        movie = update_movie(db, movie_id=movie_id, data={"trailer_url": url})
    except ValueError as e:
        if str(e) == "NOT_FOUND":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
        raise

    return UpdateMovieResponse(movie=MovieOut.model_validate(movie))


@router.get("/{movie_id}", response_model=MovieOut)
def get_movie_details_api(
    movie_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return details for a single movie.

    Security: Authenticated users. Admin not required.
    """
    try:
        movie = get_movie(db, movie_id=movie_id)
    except ValueError as e:
        if str(e) == "NOT_FOUND":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
        raise
    return MovieOut.model_validate(movie)


@router.post("/{movie_id}/upload-video", response_model=MovieVideoUploadResponse)
def upload_movie_video_api(
    movie_id: int,
    file: UploadFile = File(..., description="Video file to upload"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a source video, convert to HLS (m3u8 + .ts chunks) via ffmpeg, upload assets to Cloudinary (raw),
    update the movie's video_url with the playlist URL, and return it.

    Security: Admin-only.
    """
    _ensure_admin(current_user)

    # Validate env for Cloudinary
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    print(cloud_name)
    if not cloud_name or not os.getenv("CLOUDINARY_API_KEY") or not os.getenv("CLOUDINARY_API_SECRET"):
        raise HTTPException(status_code=500, detail="Cloudinary is not configured on the server")

    # Create temp working directory
    with tempfile.TemporaryDirectory(prefix="upload_hls_") as tmpdir:
        tmpdir_path = Path(tmpdir)
        src_path = tmpdir_path / file.filename

        # Save the uploaded file to disk
        try:
            with src_path.open("wb") as f:
                f.write(file.file.read())
        finally:
            file.file.close()

        # Transcode to HLS
        base_name = Path(file.filename).stem
        hls_dir = tmpdir_path / "hls"
        try:
            index_path, outputs = transcode_to_hls(str(src_path), str(hls_dir), base_name=base_name)
        except FFmpegNotFound as e:
            raise HTTPException(status_code=500, detail=str(e))
        except Exception:
            raise HTTPException(status_code=500, detail="ffmpeg failed to process the video")

        # Prepare uploads list (upload m3u8 and .ts)
        folder = f"movies/{movie_id}/{base_name}"
        upload_pairs: list[tuple[str, str]] = []
        for local in outputs:
            lp = Path(local)
            upload_pairs.append((str(lp), lp.name))

        # Upload to Cloudinary as raw assets
        try:
            upload_files_as_raw(upload_pairs, folder=folder)
        except Exception:
            raise HTTPException(status_code=502, detail="Failed to upload HLS assets to Cloudinary")

        playlist_filename = Path(index_path).name
        final_m3u8_url = raw_url_for(cloud_name, folder, playlist_filename)

        # Persist URL to DB
        try:
            movie = update_movie(db, movie_id=movie_id, data={"video_url": final_m3u8_url})
        except ValueError as e:
            if str(e) == "NOT_FOUND":
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
            raise

        return MovieVideoUploadResponse(video_url=final_m3u8_url, playlist_filename=playlist_filename)


@router.post("/{movie_id}/upload-thumbnail", response_model=UpdateMovieResponse)
def upload_movie_thumbnail_api(
    movie_id: int,
    file: UploadFile = File(..., description="Image file to upload as thumbnail"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a thumbnail image to Cloudinary and update the movie's thumbnail_url.

    Steps:
    - Authentication via cookie, Authorization: admin only
    - Validate file type and Cloudinary env config
    - Stream to temp, upload to Cloudinary (resource_type=image)
    - Persist URL to DB and return UpdateMovieResponse
    """
    _ensure_admin(current_user)

    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid thumbnail file type")

    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME")
    if not cloud_name or not os.getenv("CLOUDINARY_API_KEY") or not os.getenv("CLOUDINARY_API_SECRET"):
        raise HTTPException(status_code=500, detail="Cloudinary is not configured on the server")

    with tempfile.TemporaryDirectory(prefix="upload_thumb_") as tmpdir:
        tmp_path = Path(tmpdir) / file.filename
        try:
            with tmp_path.open("wb") as f:
                f.write(file.file.read())
        finally:
            file.file.close()

        folder = f"movies/{movie_id}/thumbnails"
        public_basename = Path(file.filename).stem
        try:
            res = cloudinary.uploader.upload(
                str(tmp_path),
                resource_type="image",
                folder=folder,
                public_id=public_basename,
                overwrite=True,
            )
        except Exception:
            raise HTTPException(status_code=502, detail="Failed to upload thumbnail to Cloudinary")

    url = res.get("secure_url") or res.get("url")
    if not url:
        raise HTTPException(status_code=502, detail="Cloudinary did not return a URL for thumbnail")

    try:
        movie = update_movie(db, movie_id=movie_id, data={"thumbnail_url": url})
    except ValueError as e:
        if str(e) == "NOT_FOUND":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")
        raise

    return UpdateMovieResponse(movie=MovieOut.model_validate(movie))
