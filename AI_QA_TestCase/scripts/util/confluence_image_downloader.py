#!/usr/bin/env python3
import argparse
import json
import os
import re
import sys
import urllib.request


def extract_context(text, start, end, width=160):
    before = text[max(0, start - width):start].strip()
    after = text[end:min(len(text), end + width)].strip()
    return before, after


def download(url, path):
    try:
        with urllib.request.urlopen(url, timeout=20) as response:
            with open(path, "wb") as out:
                out.write(response.read())
        return True, None
    except Exception as exc:
        return False, str(exc)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--output-dir", required=True)
    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as handle:
        text = handle.read()

    os.makedirs(args.output_dir, exist_ok=True)
    patterns = [
        re.compile(r"!\[[^\]]*\]\((https?://[^)\s]+)\)"),
        re.compile(r'<img[^>]+src=["\'](https?://[^"\']+)["\']', re.IGNORECASE),
    ]

    matches = []
    for pattern in patterns:
        matches.extend(pattern.finditer(text))
    matches.sort(key=lambda m: m.start())

    info = []
    for idx, match in enumerate(matches, start=1):
        url = match.group(1)
        before, after = extract_context(text, match.start(), match.end())
        ext = os.path.splitext(url.split("?")[0])[1] or ".bin"
        local_name = f"img_{idx:02d}{ext}"
        local_path = os.path.join(args.output_dir, local_name)

        downloaded = False
        error = None
        if url.startswith("http://") or url.startswith("https://"):
            downloaded, error = download(url, local_path)

        info.append({
            "index": idx,
            "source": url,
            "local_path": local_path if downloaded else None,
            "downloaded": downloaded,
            "error": error,
            "context_before": before,
            "context_after": after,
        })

    out_path = os.path.join(args.output_dir, "images_info.json")
    with open(out_path, "w", encoding="utf-8") as handle:
        json.dump(info, handle, ensure_ascii=False, indent=2)

    print(out_path)
    return 0


if __name__ == "__main__":
    sys.exit(main())
