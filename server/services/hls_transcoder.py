import os
import subprocess
import tempfile
from pathlib import Path
from typing import List, Tuple


class FFmpegNotFound(Exception):
    pass


def ensure_ffmpeg() -> None:
    from shutil import which

    if which("ffmpeg") is None:
        raise FFmpegNotFound("ffmpeg binary not found in PATH. Please install ffmpeg.")


def transcode_to_hls(
    input_path: str,
    output_dir: str,
    base_name: str,
    segment_time: int = 6,
) -> Tuple[str, List[str]]:
    """
    Transcode a video into HLS format using ffmpeg.

    Args:
        input_path: Local path to the source video file.
        output_dir: Directory where HLS outputs should be written.
        base_name: Base filename (without extension) for output assets.
        segment_time: Segment duration in seconds.

    Returns:
        (index_path, all_output_files)
    """
    ensure_ffmpeg()

    out_dir = Path(output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    index_path = out_dir / f"{base_name}.m3u8"
    segment_pattern = out_dir / f"{base_name}_%03d.ts"

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        input_path,
        "-c:v",
        "h264",
        "-c:a",
        "aac",
        "-ac",
        "2",
        "-preset",
        "veryfast",
        "-f",
        "hls",
        "-hls_time",
        str(segment_time),
        "-hls_playlist_type",
        "vod",
        "-hls_segment_filename",
        str(segment_pattern),
        str(index_path),
    ]

    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

    # Collect generated files
    outputs = [str(p) for p in out_dir.glob(f"{base_name}*.m3u8")]
    outputs += [str(p) for p in out_dir.glob(f"{base_name}_*.ts")]

    return str(index_path), sorted(outputs)
