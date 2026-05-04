"""Generate Kakao static emoticon PNGs with the OpenAI Images API."""

from __future__ import annotations

import argparse
import base64
import io
import json
import logging
import os
import re
import time
from dataclasses import dataclass
from pathlib import Path

from openai import OpenAI
from PIL import Image, ImageOps

from optimize_icon import optimize_icon

ROOT_DIR = Path(__file__).resolve().parent
DEFAULT_PROMPTS_PATH = ROOT_DIR / "prompts.json"
DEFAULT_BASE_PROMPT_PATH = ROOT_DIR / "base_prompt.txt"
DEFAULT_OUTPUT_DIR = ROOT_DIR / "output" / "360"
DEFAULT_ICON_DIR = ROOT_DIR / "output" / "icon"
DEFAULT_REFERENCE_IMAGE_PATH = ROOT_DIR / "reference_style.png"
TARGET_IMAGE_SIZE = (360, 360)
ICON_SOURCE_NAME = "01_좋아.png"
ICON_OUTPUT_NAME = "01_좋아_icon.png"
RESAMPLE = getattr(Image, "Resampling", Image).LANCZOS


@dataclass(frozen=True)
class PromptItem:
    """One emoticon generation request."""

    no: str
    name: str
    text: str
    prompt: str

    @property
    def filename(self) -> str:
        return f"{self.no}_{sanitize_filename(self.name)}.png"


def sanitize_filename(name: str) -> str:
    """Remove characters that are invalid in Windows filenames."""
    sanitized = re.sub(r'[<>:"/\\|?*]+', "_", name).strip()
    if not sanitized:
        raise ValueError("Prompt name produced an empty filename.")
    return sanitized


def load_prompt_items(path: Path) -> list[PromptItem]:
    """Load and validate the prompt definitions."""
    with path.open("r", encoding="utf-8") as handle:
        payload = json.load(handle)

    raw_items = payload.get("prompts", payload) if isinstance(payload, dict) else payload
    if not isinstance(raw_items, list):
        raise ValueError("prompts.json must contain a list or an object with a 'prompts' list.")
    if not raw_items:
        raise ValueError("prompts.json must contain at least one prompt.")

    items: list[PromptItem] = []
    seen_filenames: set[str] = set()
    for index, raw_item in enumerate(raw_items, start=1):
        if not isinstance(raw_item, dict):
            raise ValueError(f"Prompt #{index} must be a JSON object.")

        no = str(raw_item["no"]).zfill(2)
        expected_no = f"{index:02d}"
        if no != expected_no:
            raise ValueError(f"Prompt #{index} should use no='{expected_no}', found '{no}'.")

        fallback_name = str(raw_item.get("text", raw_item["no"])).strip()
        fallback_name = re.sub(r"[!?.~]+$", "", fallback_name).strip() or str(raw_item["no"])
        name = str(raw_item.get("name", fallback_name)).strip()
        text = str(raw_item.get("text", name)).strip()
        prompt = str(raw_item["prompt"]).strip()
        item = PromptItem(no=no, name=name, text=text, prompt=prompt)

        if item.filename in seen_filenames:
            raise ValueError(f"Duplicate output filename detected: {item.filename}")
        seen_filenames.add(item.filename)
        items.append(item)

    return items


def load_base_prompt(path: Path) -> str:
    """Load the shared style prompt."""
    base_prompt = path.read_text(encoding="utf-8").strip()
    if not base_prompt:
        raise ValueError("base_prompt.txt is empty.")
    return base_prompt


def build_prompt(base_prompt: str, item: PromptItem) -> str:
    """Combine the common style prompt with the per-image prompt."""
    return "\n".join(
        [
            base_prompt,
            f"Requested text: {item.text}",
            f"Scene: {item.prompt}",
        ]
    )


def generate_image_bytes(
    client: OpenAI,
    prompt: str,
    model: str,
    image_size: str,
    quality: str,
    reference_image: Path | None,
    reference_fidelity: str,
    max_retries: int,
    retry_delay: float,
) -> bytes:
    """Call the OpenAI Images API with retry logic."""
    for attempt in range(1, max_retries + 1):
        try:
            if reference_image is not None:
                with reference_image.open("rb") as handle:
                    response = client.images.edit(
                        model=model,
                        image=handle,
                        prompt=prompt,
                        size=image_size,
                        quality=quality,
                        input_fidelity=reference_fidelity,
                        output_format="png",
                    )
            else:
                response = client.images.generate(
                    model=model,
                    prompt=prompt,
                    size=image_size,
                    quality=quality,
                    output_format="png",
                )

            if not response.data:
                raise RuntimeError("The Images API returned no image data.")

            encoded_image = response.data[0].b64_json
            if not encoded_image:
                raise RuntimeError("The Images API response did not include base64 image content.")

            return base64.b64decode(encoded_image)
        except Exception as exc:
            if attempt >= max_retries:
                raise RuntimeError(f"Image generation failed after {max_retries} attempts.") from exc

            sleep_seconds = retry_delay * (2 ** (attempt - 1))
            logging.warning(
                "Generation attempt %s/%s failed: %s. Retrying in %.1f seconds.",
                attempt,
                max_retries,
                exc,
                sleep_seconds,
            )
            time.sleep(sleep_seconds)

    raise RuntimeError("Unexpected retry loop exit.")


def save_resized_png(image_bytes: bytes, output_path: Path) -> None:
    """Resize the generated image to 360x360 and save as PNG."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(io.BytesIO(image_bytes)) as image:
        prepared = ImageOps.fit(image.convert("RGBA"), TARGET_IMAGE_SIZE, method=RESAMPLE)
        prepared.save(output_path, format="PNG", optimize=True)


def parse_args() -> argparse.Namespace:
    """Build the CLI parser."""
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--prompts", type=Path, default=DEFAULT_PROMPTS_PATH)
    parser.add_argument("--base-prompt", type=Path, default=DEFAULT_BASE_PROMPT_PATH)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--icon-dir", type=Path, default=DEFAULT_ICON_DIR)
    parser.add_argument(
        "--reference-image",
        type=Path,
        default=DEFAULT_REFERENCE_IMAGE_PATH,
        help="Optional reference image used to keep the character design consistent.",
    )
    parser.add_argument(
        "--reference-fidelity",
        choices=("low", "high"),
        default=os.getenv("OPENAI_IMAGE_REFERENCE_FIDELITY", "high"),
        help="How strongly the edit endpoint should preserve the reference image.",
    )
    parser.add_argument("--model", default=os.getenv("OPENAI_IMAGE_MODEL", "gpt-image-1"))
    parser.add_argument("--size", default=os.getenv("OPENAI_IMAGE_SOURCE_SIZE", "1024x1024"))
    parser.add_argument("--quality", default=os.getenv("OPENAI_IMAGE_QUALITY", "medium"))
    parser.add_argument("--retries", type=int, default=int(os.getenv("OPENAI_IMAGE_RETRIES", "3")))
    parser.add_argument("--retry-delay", type=float, default=float(os.getenv("OPENAI_IMAGE_RETRY_DELAY", "2")))
    parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Generate only the first N prompts after validation.",
    )
    parser.add_argument(
        "--icon-source",
        default=ICON_SOURCE_NAME,
        help="Filename inside output/360 that will be used for the 78x78 icon.",
    )
    parser.add_argument(
        "--icon-output",
        default=ICON_OUTPUT_NAME,
        help="Filename to write inside output/icon.",
    )
    parser.add_argument(
        "--skip-icon",
        action="store_true",
        help="Skip 78x78 icon creation at the end of the run.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Regenerate images even if output files already exist.",
    )
    return parser.parse_args()


def main() -> int:
    """Generate the requested emoticons and the optimized icon."""
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    args = parse_args()

    prompt_items = load_prompt_items(args.prompts)
    if args.limit is not None:
        if args.limit <= 0:
            raise ValueError("--limit must be greater than 0.")
        prompt_items = prompt_items[: args.limit]
        if not prompt_items:
            raise ValueError("--limit produced an empty prompt list.")

    base_prompt = load_base_prompt(args.base_prompt)
    client = OpenAI()
    reference_image = args.reference_image if args.reference_image.exists() else None

    if reference_image is not None:
        logging.info("Using reference image: %s", reference_image)
    else:
        logging.warning(
            "Reference image not found at %s. Falling back to text-only generation.",
            args.reference_image,
        )

    args.output_dir.mkdir(parents=True, exist_ok=True)
    args.icon_dir.mkdir(parents=True, exist_ok=True)

    generated_count = 0
    skipped_count = 0

    logging.info("Preparing to process %s prompt(s).", len(prompt_items))

    for item in prompt_items:
        output_path = args.output_dir / item.filename
        if output_path.exists() and not args.overwrite:
            skipped_count += 1
            logging.info("Skipping existing file: %s", output_path.name)
            continue

        full_prompt = build_prompt(base_prompt, item)
        logging.info("Generating %s", output_path.name)
        image_bytes = generate_image_bytes(
            client=client,
            prompt=full_prompt,
            model=args.model,
            image_size=args.size,
            quality=args.quality,
            reference_image=reference_image,
            reference_fidelity=args.reference_fidelity,
            max_retries=args.retries,
            retry_delay=args.retry_delay,
        )
        save_resized_png(image_bytes, output_path)
        generated_count += 1

    logging.info("Generation complete. Created=%s, skipped=%s", generated_count, skipped_count)

    if args.skip_icon:
        logging.info("Icon generation skipped.")
        return 0

    icon_source_path = args.output_dir / args.icon_source
    if not icon_source_path.exists():
        raise FileNotFoundError(
            f"Icon source image not found: {icon_source_path}. "
            "Generate the base emoticon first or check the prompts ordering."
        )

    icon_output_path = args.icon_dir / args.icon_output
    icon_size = optimize_icon(icon_source_path, icon_output_path)
    logging.info("Optimized icon saved to %s (%s bytes)", icon_output_path, icon_size)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
