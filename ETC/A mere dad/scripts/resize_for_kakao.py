from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image


def resize_and_optimize(
    source_path: Path,
    destination_path: Path,
    size: int,
    colors: int,
) -> None:
    source = Image.open(source_path).convert("RGBA")
    resized = source.resize((size, size), Image.Resampling.LANCZOS)

    # Palette conversion keeps transparency while reducing PNG size.
    paletted = resized.quantize(colors=colors, method=Image.Quantize.FASTOCTREE)
    paletted.save(destination_path, format="PNG", optimize=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Resize sticker PNGs for Kakao emoticon submission."
    )
    parser.add_argument("--input-dir", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--size", type=int, default=360)
    parser.add_argument("--colors", type=int, default=256)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    for source_path in sorted(args.input_dir.glob("*.png")):
        destination_path = args.output_dir / source_path.name
        resize_and_optimize(
            source_path=source_path,
            destination_path=destination_path,
            size=args.size,
            colors=args.colors,
        )
        print(f"Created {destination_path.name}")


if __name__ == "__main__":
    main()
