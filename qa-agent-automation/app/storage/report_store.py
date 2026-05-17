"""File storage for generated QA reports."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from app.schemas.report import QaReport
from app.schemas.email import EmailPayload


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

    def save_json(self, report: QaReport) -> Path:
        """Save a structured report as reports/YYYY-MM-DD.json and return the path."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        report_date = report.generated_at.date().isoformat()
        report_path = self.output_dir / f"{report_date}.json"
        report_path.write_text(
            report.model_dump_json(indent=2),
            encoding="utf-8",
        )
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

    def save_index(self) -> Path:
        """Save an index.html file listing generated report manifests."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        manifests = sorted(self.output_dir.glob("*.manifest.json"), reverse=True)
        rows = []
        for manifest in manifests:
            payload = json.loads(manifest.read_text(encoding="utf-8"))
            artifacts = payload.get("artifacts", {})
            rows.append(
                "<tr>"
                f"<td>{payload.get('generated_at', '-')}</td>"
                f"<td>{payload.get('repository', '-')}</td>"
                f"<td>{payload.get('total_issues', '-')}</td>"
                f"<td>{self._artifact_link(artifacts.get('markdown'), 'Markdown')}</td>"
                f"<td>{self._artifact_link(artifacts.get('html'), 'HTML')}</td>"
                f"<td>{self._artifact_link(artifacts.get('html_ko'), 'HTML KO')}</td>"
                f"<td>{self._artifact_link(artifacts.get('json'), 'JSON')}</td>"
                "</tr>"
            )

        index_path = self.output_dir / "index.html"
        index_path.write_text(
            self._index_html("".join(rows) or "<tr><td colspan='7'>No reports yet.</td></tr>"),
            encoding="utf-8",
        )
        return index_path

    def save_email_payload(self, report: QaReport, payload: EmailPayload) -> Path:
        """Save a mock email payload as JSON."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        report_date = report.generated_at.date().isoformat()
        payload_path = self.output_dir / f"{report_date}.email.json"
        payload_path.write_text(
            payload.model_dump_json(indent=2),
            encoding="utf-8",
        )
        return payload_path

    def _artifact_link(self, artifact_path: str | None, label: str) -> str:
        """Render a report artifact link for index.html."""
        if not artifact_path:
            return "-"
        href = Path(artifact_path).name
        return f'<a href="{href}">{label}</a>'

    def _index_html(self, rows: str) -> str:
        """Render the report index HTML."""
        return (
            "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">"
            "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">"
            "<title>QA Report Index</title></head>"
            "<body style=\"font-family:Arial,Helvetica,sans-serif;background:#f3f6fb;"
            "color:#111827;margin:0;padding:24px;\">"
            "<main style=\"max-width:960px;margin:0 auto;background:#fff;border:1px solid #d9e2f1;"
            "padding:24px;\">"
            "<h1 style=\"margin-top:0;\">QA Report Index</h1>"
            "<table width=\"100%\" cellspacing=\"0\" cellpadding=\"8\" "
            "style=\"border-collapse:collapse;\">"
            "<tr style=\"background:#edf2f7;\"><th align=\"left\">Generated</th>"
            "<th align=\"left\">Repository</th><th align=\"left\">Issues</th>"
            "<th align=\"left\">Markdown</th><th align=\"left\">HTML</th>"
            "<th align=\"left\">HTML KO</th><th align=\"left\">JSON</th></tr>"
            f"{rows}</table></main></body></html>"
        )
