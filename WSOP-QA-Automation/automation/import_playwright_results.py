#!/usr/bin/env python
"""
Import Playwright JSON results into a Google-Sheet-ready payload.

This script does not require third-party packages. It can either:
- write a payload JSON file for review, or
- POST the payload to the Apps Script webhook in google-sheets-webhook/Code.gs.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import re
import sys
import urllib.request
from pathlib import Path
from typing import Any


TC_ID_RE = re.compile(r"\bTC-[A-Z]+-\d{3}\b")


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def find_specs(node: Any) -> list[dict[str, Any]]:
    specs: list[dict[str, Any]] = []
    if isinstance(node, dict):
        if "tests" in node and "title" in node:
            specs.append(node)
        for value in node.values():
            specs.extend(find_specs(value))
    elif isinstance(node, list):
        for item in node:
            specs.extend(find_specs(item))
    return specs


def extract_tc_id(*texts: str) -> str | None:
    for text in texts:
        match = TC_ID_RE.search(text or "")
        if match:
            return match.group(0)
    return None


def flatten_title(spec: dict[str, Any], test: dict[str, Any]) -> str:
    titles = []
    for key in ("titlePath", "title"):
        value = test.get(key) or spec.get(key)
        if isinstance(value, list):
            titles.extend(str(part) for part in value if part)
        elif value:
            titles.append(str(value))
    if not titles:
        return "Untitled Playwright test"
    return " > ".join(dict.fromkeys(titles))


def first_result(test: dict[str, Any]) -> dict[str, Any]:
    results = test.get("results") or []
    if results:
        return results[-1]
    return {}


def map_status(status: str, status_map: dict[str, str]) -> str:
    return status_map.get(status, "Blocked")


def collect_error(result: dict[str, Any]) -> str:
    errors = result.get("errors") or []
    if errors:
        messages = []
        for error in errors:
            if isinstance(error, dict):
                messages.append(error.get("message") or error.get("stack") or json.dumps(error))
            else:
                messages.append(str(error))
        return "\n".join(message for message in messages if message)
    if result.get("error"):
        return str(result["error"])
    return ""


def collect_evidence(result: dict[str, Any], base_url: str | None) -> str:
    attachments = result.get("attachments") or []
    paths = []
    for attachment in attachments:
        path = attachment.get("path") if isinstance(attachment, dict) else None
        if path:
            paths.append(path)
    if not paths:
        return ""
    if base_url:
        return "\n".join(f"{base_url.rstrip('/')}/{Path(path).name}" for path in paths)
    return "\n".join(paths)


def build_payload(args: argparse.Namespace, config: dict[str, Any], report: dict[str, Any]) -> dict[str, Any]:
    today = args.run_date or dt.date.today().isoformat()
    defaults = config.get("defaultRun", {})
    status_map = config.get("statusMap", {})
    execution_rows = []
    defect_candidates = []

    for spec in find_specs(report):
        spec_title = str(spec.get("title") or "")
        for test in spec.get("tests", []):
            title = flatten_title(spec, test)
            tc_id = extract_tc_id(title, spec_title)
            if not tc_id:
                continue

            result = first_result(test)
            playwright_status = str(result.get("status") or test.get("status") or "skipped")
            mapped_status = map_status(playwright_status, status_map)
            actual = collect_error(result)
            evidence = collect_evidence(result, args.evidence_base_url)

            row = {
                "runId": args.run_id,
                "runDate": today,
                "buildVersion": args.build_version,
                "environment": args.environment or defaults.get("environment", "TBD"),
                "device": args.device or defaults.get("device", "Android TBD"),
                "tcId": tc_id,
                "tcTitle": title,
                "result": mapped_status,
                "actualResult": actual,
                "evidenceLink": evidence,
                "defectId": "",
                "tester": args.tester or defaults.get("tester", "QA"),
                "notes": f"Playwright status: {playwright_status}"
            }
            execution_rows.append(row)

            if mapped_status == "Fail":
                defect_candidates.append({
                    "runId": args.run_id,
                    "defectId": "",
                    "tcId": tc_id,
                    "category": "",
                    "severity": "Major",
                    "priority": "P1",
                    "title": f"Failure: {title}",
                    "status": "Open",
                    "owner": "",
                    "foundDate": today,
                    "evidenceLink": evidence,
                    "expected": "Expected result from TC_Master",
                    "actual": actual or "Playwright test failed",
                    "notes": "Generated from Playwright result"
                })

    return {
        "spreadsheetId": config.get("spreadsheetId"),
        "runId": args.run_id,
        "generatedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "executionLogRows": execution_rows,
        "defectCandidates": defect_candidates
    }


def post_payload(url: str, payload: dict[str, Any]) -> None:
    data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        body = response.read().decode("utf-8")
        print(body)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-id", required=True)
    parser.add_argument("--report", required=True, type=Path)
    parser.add_argument("--config", default=Path("automation/config/wsop_qa_config.json"), type=Path)
    parser.add_argument("--out", default=Path("automation/output/sheet_payload.json"), type=Path)
    parser.add_argument("--build-version", default="TBD")
    parser.add_argument("--environment")
    parser.add_argument("--device")
    parser.add_argument("--tester")
    parser.add_argument("--run-date")
    parser.add_argument("--evidence-base-url")
    parser.add_argument("--webhook-url", default=os.environ.get("QA_SHEET_WEBHOOK_URL"))
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    config = load_json(args.config)
    report = load_json(args.report)
    payload = build_payload(args, config, report)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote payload: {args.out}")
    print(f"Execution rows: {len(payload['executionLogRows'])}")
    print(f"Defect candidates: {len(payload['defectCandidates'])}")

    if args.webhook_url:
        post_payload(args.webhook_url, payload)
    return 0


if __name__ == "__main__":
    sys.exit(main())
