#!/usr/bin/env python
"""
Generate a small QA report from an imported Playwright payload.
"""

from __future__ import annotations

import argparse
import html
import json
from collections import Counter
from pathlib import Path
from typing import Any


def load_payload(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def decide(counts: Counter[str]) -> str:
    if counts["Fail"] > 0:
        return "No-Go Review"
    if counts["Blocked"] > 0:
        return "Conditional Go"
    if counts["Not Run"] > 0:
        return "In Progress"
    return "Go Candidate"


def build_summary(payload: dict[str, Any]) -> dict[str, Any]:
    rows = payload.get("executionLogRows", [])
    counts = Counter(row.get("result", "Not Run") for row in rows)
    total = len(rows)
    pass_rate = 0 if total == 0 else round((counts["Pass"] / total) * 100, 1)
    return {
        "runId": payload.get("runId"),
        "total": total,
        "pass": counts["Pass"],
        "fail": counts["Fail"],
        "blocked": counts["Blocked"],
        "notRun": counts["Not Run"],
        "passRate": pass_rate,
        "defectCandidates": len(payload.get("defectCandidates", [])),
        "decision": decide(counts),
    }


def render_html(summary: dict[str, Any], payload: dict[str, Any]) -> str:
    rows = payload.get("executionLogRows", [])
    row_html = []
    for row in rows:
        row_html.append(
            "<tr>"
            f"<td>{html.escape(row.get('tcId', ''))}</td>"
            f"<td>{html.escape(row.get('tcTitle', ''))}</td>"
            f"<td>{html.escape(row.get('result', ''))}</td>"
            f"<td>{html.escape(row.get('actualResult', ''))}</td>"
            f"<td>{html.escape(row.get('evidenceLink', ''))}</td>"
            "</tr>"
        )

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>WSOP QA Report - {html.escape(str(summary.get("runId")))}</title>
  <style>
    body {{ font-family: Arial, sans-serif; margin: 32px; color: #1f2933; }}
    h1 {{ margin-bottom: 8px; }}
    .summary {{ display: grid; grid-template-columns: repeat(4, minmax(120px, 1fr)); gap: 12px; margin: 20px 0; }}
    .card {{ border: 1px solid #d6dde5; padding: 12px; border-radius: 6px; }}
    .label {{ color: #607080; font-size: 12px; }}
    .value {{ font-size: 22px; font-weight: 700; margin-top: 4px; }}
    table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
    th, td {{ border-bottom: 1px solid #d6dde5; padding: 8px; text-align: left; vertical-align: top; }}
    th {{ background: #19384a; color: white; }}
  </style>
</head>
<body>
  <h1>WSOP QA Report</h1>
  <p>Run ID: {html.escape(str(summary.get("runId")))}</p>
  <div class="summary">
    <div class="card"><div class="label">Total</div><div class="value">{summary["total"]}</div></div>
    <div class="card"><div class="label">Pass</div><div class="value">{summary["pass"]}</div></div>
    <div class="card"><div class="label">Fail</div><div class="value">{summary["fail"]}</div></div>
    <div class="card"><div class="label">Blocked</div><div class="value">{summary["blocked"]}</div></div>
    <div class="card"><div class="label">Not Run</div><div class="value">{summary["notRun"]}</div></div>
    <div class="card"><div class="label">Pass Rate</div><div class="value">{summary["passRate"]}%</div></div>
    <div class="card"><div class="label">Defect Candidates</div><div class="value">{summary["defectCandidates"]}</div></div>
    <div class="card"><div class="label">Decision</div><div class="value">{html.escape(summary["decision"])}</div></div>
  </div>
  <table>
    <thead><tr><th>TC ID</th><th>Title</th><th>Result</th><th>Actual</th><th>Evidence</th></tr></thead>
    <tbody>{''.join(row_html)}</tbody>
  </table>
</body>
</html>
"""


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--payload", required=True, type=Path)
    parser.add_argument("--out-dir", default=Path("automation/output"), type=Path)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    payload = load_payload(args.payload)
    summary = build_summary(payload)
    args.out_dir.mkdir(parents=True, exist_ok=True)

    summary_path = args.out_dir / "qa_report_summary.json"
    html_path = args.out_dir / "qa_report.html"
    summary_path.write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    html_path.write_text(render_html(summary, payload), encoding="utf-8")

    print(f"Wrote summary: {summary_path}")
    print(f"Wrote html report: {html_path}")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
