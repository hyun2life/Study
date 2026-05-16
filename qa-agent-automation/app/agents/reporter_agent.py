"""Markdown report generation agent."""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app.schemas.issue import ClassifiedIssue
from app.schemas.report import QaReport, ReportSummary, ReviewFinding


class ReporterAgent:
    """Build a Markdown-ready QA report from classified issues."""

    def __init__(self, timezone_name: str = "Asia/Seoul") -> None:
        self.timezone_name = timezone_name

    def build_report(
        self,
        title: str,
        repository: str,
        issues: list[ClassifiedIssue],
        findings: list[ReviewFinding],
    ) -> QaReport:
        """Create a report schema with aggregated summary data."""
        summary = ReportSummary(
            total_issues=len(issues),
            by_category=dict(Counter(item.category for item in issues)),
            by_severity=dict(Counter(item.severity for item in issues)),
        )
        return QaReport(
            title=title,
            repository=repository,
            generated_at=self._now(),
            summary=summary,
            issues=issues,
            findings=findings,
        )

    def _now(self) -> datetime:
        """Return the current time in the configured report timezone."""
        try:
            return datetime.now(ZoneInfo(self.timezone_name))
        except ZoneInfoNotFoundError:
            if self.timezone_name == "Asia/Seoul":
                return datetime.now(timezone(timedelta(hours=9)))
            return datetime.now(timezone.utc)
