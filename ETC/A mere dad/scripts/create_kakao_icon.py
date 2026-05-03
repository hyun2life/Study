from __future__ import annotations

import argparse
import io
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


def render_icon(
    source_path: Path,
    destination_path: Path,
    threshold: int,
    size: int,
    padding: int,
    stroke: int,
    colors: int,
    max_bytes: int,
) -> tuple[int, int]:
    source = Image.open(source_path).convert("RGBA")
    foreground_mask = build_foreground_mask(source, threshold)
    foreground_mask = foreground_mask.filter(ImageFilter.MaxFilter(3))

    bbox = foreground_mask.getbbox()
    if bbox is None:
        raise ValueError(f"No foreground detected in {source_path}")

    cropped_image = source.crop(bbox)
    cropped_mask = foreground_mask.crop(bbox)

    stroke_size = stroke * 2 + 1
    expanded_mask = cropped_mask.filter(ImageFilter.MaxFilter(stroke_size))
    stroke_mask = ImageChops.subtract(expanded_mask, cropped_mask)

    cutout = cropped_image.copy()
    cutout.putalpha(cropped_mask)

    outlined_width, outlined_height = expanded_mask.size
    sticker_base = Image.new("RGBA", (outlined_width, outlined_height), (255, 255, 255, 0))
    sticker_base.putalpha(stroke_mask)

    outlined = Image.alpha_composite(sticker_base, cutout)

    content_limit = size - padding * 2
    scale = min(content_limit / outlined.width, content_limit / outlined.height)
    resized_width = max(1, round(outlined.width * scale))
    resized_height = max(1, round(outlined.height * scale))
    resized = outlined.resize((resized_width, resized_height), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    offset_x = (size - resized_width) // 2
    offset_y = (size - resized_height) // 2
    canvas.alpha_composite(resized, (offset_x, offset_y))

    palette_size = min(colors, 256)
    best_data: bytes | None = None
    best_palette = palette_size

    while palette_size >= 8:
        paletted = canvas.quantize(colors=palette_size, method=Image.Quantize.FASTOCTREE)
        buffer = io.BytesIO()
        paletted.save(buffer, format="PNG", optimize=True)
        candidate = buffer.getvalue()
        best_data = candidate
        best_palette = palette_size
        if len(candidate) <= max_bytes:
            break
        palette_size //= 2

    if best_data is None:
        raise ValueError("Failed to encode output PNG")

    destination_path.parent.mkdir(parents=True, exist_ok=True)
    destination_path.write_bytes(best_data)
    return len(best_data), best_palette


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a Kakao icon PNG with transparent background and white outline."
    )
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--threshold", type=int, default=245)
    parser.add_argument("--size", type=int, default=78)
    parser.add_argument("--padding", type=int, default=4)
    parser.add_argument("--stroke", type=int, default=3)
    parser.add_argument("--colors", type=int, default=128)
    parser.add_argument("--max-bytes", type=int, default=16 * 1024)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    file_size, palette_size = render_icon(
        source_path=args.input,
        destination_path=args.output,
        threshold=args.threshold,
        size=args.size,
        padding=args.padding,
        stroke=args.stroke,
        colors=args.colors,
        max_bytes=args.max_bytes,
    )
    print(f"Created {args.output.name} ({args.size}x{args.size}, {file_size} bytes, {palette_size} colors)")


if __name__ == "__main__":
    main()
