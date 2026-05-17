"""File storage for generated QA reports."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.schemas.report import QaReport


class ReportStore:
    """Persist rendered reports to a local directory."""

    def __init__(self, output_dir: str | Path) -> None:
        self.output_dir = Path(output_dir)

    def save_markdown(self, report: QaReport, markdown: str) -> Path:
        """Save a report as reports/YYYY-MM-DD.md and return the path."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        report_date = report.generated_at.date().isoformat()
        report_path = self.output_dir / f"{report_date}.md"
        report_path.write_text(markdown, encoding="utf-8")
        return report_path

    def save_html(self, report: QaReport, html: str) -> Path:
        """Save a report as reports/YYYY-MM-DD.html and return the path."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        report_date = report.generated_at.date().isoformat()
        report_path = self.output_dir / f"{report_date}.html"
        report_path.write_text(html, encoding="utf-8")
        return report_path

    def save_korean_html(self, report: QaReport, html: str) -> Path:
        """Save a Korean report as reports/YYYY-MM-DD.ko.html and return the path."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        report_date = report.generated_at.date().isoformat()
        report_path = self.output_dir / f"{report_date}.ko.html"
        report_path.write_text(html, encoding="utf-8")
        return report_path

    def save_manifest(self, report: QaReport, paths: dict[str, str | None]) -> Path:
        """Save generated report artifact paths as JSON."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        report_date = report.generated_at.date().isoformat()
        manifest_path = self.output_dir / f"{report_date}.manifest.json"
        payload: dict[str, Any] = {
            "title": report.title,
            "repository": report.repository,
            "generated_at": report.generated_at.isoformat(),
            "total_issues": report.summary.total_issues,
            "artifacts": {key: value for key, value in paths.items() if value},
        }
        manifest_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return manifest_path
