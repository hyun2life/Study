"""Report-related Pydantic schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.issue import ClassifiedIssue, QaCategory, Severity


class ReportSummary(BaseModel):
    """Aggregated counts used in the daily report."""

    total_issues: int = 0
    by_category: dict[QaCategory, int] = Field(default_factory=dict)
    by_severity: dict[Severity, int] = Field(default_factory=dict)


class ReviewFinding(BaseModel):
    """A QA review note derived from classified issues."""

    title: str
    detail: str


class QaReport(BaseModel):
    """Markdown-ready QA report."""

    title: str
    repository: str
    generated_at: datetime
    summary: ReportSummary
    issues: list[ClassifiedIssue] = Field(default_factory=list)
    findings: list[ReviewFinding] = Field(default_factory=list)

    def to_markdown(self) -> str:
        """Render this report as Markdown."""
        lines = [
            f"# {self.title}",
            "",
            f"- Repository: `{self.repository}`",
            f"- Generated at: `{self.generated_at.isoformat()}`",
            f"- Total issues: **{self.summary.total_issues}**",
            "",
            "## Summary by Severity",
            "",
        ]

        for severity in ("critical", "high", "medium", "low"):
            count = self.summary.by_severity.get(severity, 0)
            lines.append(f"- {severity.title()}: {count}")

        lines.extend(["", "## Summary by Category", ""])
        for category, count in sorted(self.summary.by_category.items()):
            lines.append(f"- {category}: {count}")

        lines.extend(["", "## Reviewer Notes", ""])
        if self.findings:
            for finding in self.findings:
                lines.append(f"- **{finding.title}**: {finding.detail}")
        else:
            lines.append("- No additional reviewer notes.")

        lines.extend(["", "## Issue Details", ""])
        for item in self.issues:
            issue = item.issue
            labels = ", ".join(issue.labels) if issue.labels else "none"
            lines.extend(
                [
                    f"### #{issue.number} {issue.title}",
                    "",
                    f"- Severity: **{item.severity}**",
                    f"- Category: `{item.category}`",
                    f"- Labels: {labels}",
                    f"- URL: {issue.url}",
                    f"- QA Notes: {item.qa_notes}",
                    f"- Recommended Action: {item.recommended_action}",
                    "",
                ]
            )

        return "\n".join(lines).strip() + "\n"

