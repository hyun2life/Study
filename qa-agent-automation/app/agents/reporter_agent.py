"""Markdown report generation agent."""

from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone

from app.schemas.issue import ClassifiedIssue
from app.schemas.report import QaReport, ReportSummary, ReviewFinding


class ReporterAgent:
    """Build a Markdown-ready QA report from classified issues."""

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
            generated_at=datetime.now(timezone.utc),
            summary=summary,
            issues=issues,
            findings=findings,
        )

