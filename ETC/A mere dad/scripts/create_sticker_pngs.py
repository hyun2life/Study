from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


def build_foreground_mask(image: Image.Image, threshold: int) -> Image.Image:
    rgb = image.convert("RGB")
    width, height = rgb.size
    pixels = rgb.load()

    bg_candidate = bytearray(width * height)
    for y in range(height):
        row_start = y * width
        for x in range(width):
            r, g, b = pixels[x, y]
            if r >= threshold and g >= threshold and b >= threshold:
                bg_candidate[row_start + x] = 1

    background = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def push(x: int, y: int) -> None:
        idx = y * width + x
        if bg_candidate[idx] and not background[idx]:
            background[idx] = 1
            queue.append((x, y))

    for x in range(width):
        push(x, 0)
        push(x, height - 1)
    for y in range(height):
        push(0, y)
        push(width - 1, y)

    while queue:
        x, y = queue.popleft()
        if x > 0:
            push(x - 1, y)
        if x + 1 < width:
            push(x + 1, y)
        if y > 0:
            push(x, y - 1)
        if y + 1 < height:
            push(x, y + 1)

    mask = Image.new("L", (width, height), 0)
    mask_pixels = mask.load()
    for y in range(height):
        row_start = y * width
        for x in range(width):
            if not background[row_start + x]:
                mask_pixels[x, y] = 255

    return mask


def make_sticker_png(
    source_path: Path,
    destination_path: Path,
    threshold: int,
    stroke_px: int,
) -> None:
    source = Image.open(source_path).convert("RGBA")
    foreground_mask = build_foreground_mask(source, threshold)

    # A light expansion keeps anti-aliased edge pixels attached to the art.
    content_mask = foreground_mask.filter(ImageFilter.MaxFilter(3))

    stroke_size = stroke_px * 2 + 1
    expanded_mask = foreground_mask.filter(ImageFilter.MaxFilter(stroke_size))
    stroke_mask = ImageChops.subtract(expanded_mask, content_mask)

    sticker_base = Image.new("RGBA", source.size, (255, 255, 255, 0))
    sticker_base.putalpha(stroke_mask)

    cutout = source.copy()
    cutout.putalpha(content_mask)

    output = Image.alpha_composite(sticker_base, cutout)
    output.save(destination_path, "PNG")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create transparent sticker-style PNGs with white outlines."
    )
    parser.add_argument("--input-dir", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--threshold", type=int, default=245)
    parser.add_argument("--stroke", type=int, default=18)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    for source_path in sorted(args.input_dir.glob("*.png")):
        destination_path = args.output_dir / source_path.name
        make_sticker_png(
            source_path=source_path,
            destination_path=destination_path,
            threshold=args.threshold,
            stroke_px=args.stroke,
        )
        print(f"Created {destination_path.name}")


if __name__ == "__main__":
    main()
