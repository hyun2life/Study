"""File storage for generated QA reports."""

from __future__ import annotations

from pathlib import Path

from app.schemas.report import QaReport


class ReportStore:
    """Persist Markdown reports to a local directory."""

    def __init__(self, output_dir: str | Path) -> None:
        self.output_dir = Path(output_dir)

    def save_markdown(self, report: QaReport, markdown: str) -> Path:
        """Save a report as reports/YYYY-MM-DD.md and return the path."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        report_date = report.generated_at.date().isoformat()
        report_path = self.output_dir / f"{report_date}.md"
        report_path.write_text(markdown, encoding="utf-8")
        return report_path
