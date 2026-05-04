"""Resize and optimize a Kakao emoticon icon PNG to 78x78 and <=16KB."""

from __future__ import annotations

import argparse
import io
from pathlib import Path

from PIL import Image, ImageOps

ROOT_DIR = Path(__file__).resolve().parent
DEFAULT_SOURCE = ROOT_DIR / "output" / "360" / "01_좋아.png"
DEFAULT_OUTPUT = ROOT_DIR / "output" / "icon" / "01_좋아_icon.png"
TARGET_ICON_SIZE = (78, 78)
DEFAULT_MAX_BYTES = 16 * 1024
RESAMPLE = getattr(Image, "Resampling", Image).LANCZOS


def encode_png_bytes(image: Image.Image, colors: int | None = None) -> bytes:
    """Encode an image as an optimized PNG, optionally reducing its palette."""
    working = image.convert("RGB")
    if colors is not None:
        working = working.convert("P", palette=Image.ADAPTIVE, colors=colors)

    buffer = io.BytesIO()
    working.save(buffer, format="PNG", optimize=True, compress_level=9)
    return buffer.getvalue()


def optimize_icon(source_path: Path, output_path: Path, max_bytes: int = DEFAULT_MAX_BYTES) -> int:
    """Create a compact 78x78 PNG icon and return its final size in bytes."""
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(source_path) as source:
        resized = ImageOps.fit(source, TARGET_ICON_SIZE, method=RESAMPLE)

        best_payload: bytes | None = None
        for colors in (None, 256, 128, 64, 32, 16, 8):
            payload = encode_png_bytes(resized, colors=colors)
            if best_payload is None or len(payload) < len(best_payload):
                best_payload = payload
            if len(payload) <= max_bytes:
                output_path.write_bytes(payload)
                return len(payload)

    if best_payload is None:
        raise RuntimeError("Failed to create an icon PNG payload.")

    output_path.write_bytes(best_payload)
    raise ValueError(
        f"Could not reduce icon below {max_bytes} bytes. Final size: {len(best_payload)} bytes."
    )


def parse_args() -> argparse.Namespace:
    """Build the CLI parser."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--max-bytes", type=int, default=DEFAULT_MAX_BYTES)
    return parser.parse_args()


def main() -> int:
    """CLI entry point."""
    args = parse_args()
    final_size = optimize_icon(args.input, args.output, max_bytes=args.max_bytes)
    print(f"Saved optimized icon to {args.output} ({final_size} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
