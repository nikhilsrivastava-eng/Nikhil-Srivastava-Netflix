import os
import pathlib
from typing import Iterable, Tuple

import cloudinary
import cloudinary.uploader


# Initialize Cloudinary config from environment variables
# Required envs: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True,
)


def upload_files_as_raw(
    files: Iterable[Tuple[str, str]],
    folder: str,
) -> None:
    """
    Upload multiple files to Cloudinary as raw resources under the same folder.

    Args:
        files: Iterable of (local_path, public_id_basename). The final public_id will be f"{folder}/{public_id_basename}".
        folder: Folder prefix in Cloudinary.
    """
    for local_path, public_basename in files:
        public_id = f"{folder}/{public_basename}"
        cloudinary.uploader.upload(
            local_path,
            resource_type="raw",
            folder=folder,
            public_id=public_basename,  # will be combined with folder
            overwrite=True,
        )


def raw_url_for(cloud_name: str, folder: str, filename: str) -> str:
    # Construct a direct URL to the raw uploaded file
    # e.g., https://res.cloudinary.com/<cloud>/raw/upload/<folder>/<filename>
    return f"https://res.cloudinary.com/{cloud_name}/raw/upload/{folder}/{filename}"
