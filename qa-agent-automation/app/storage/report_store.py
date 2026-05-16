"""File storage for generated QA reports."""

from __future__ import annotations

from pathlib import Path

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
