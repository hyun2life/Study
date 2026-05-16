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
        total = self.summary.total_issues
        critical = self.summary.by_severity.get("critical", 0)
        high = self.summary.by_severity.get("high", 0)
        new_today = self._issues_created_today()
        updated_today = self._issues_updated_today()
        release_blockers = self._release_blockers()
        priority_issues = self._priority_issues()

        lines = [
            f"# {self.title}",
            "",
            "| Field | Value |",
            "| --- | --- |",
            f"| Repository | `{self.repository}` |",
            f"| Generated at | `{self.generated_at.isoformat()}` |",
            f"| Total issues | **{total}** |",
            f"| Critical / High | **{critical} / {high}** |",
            f"| New today | **{len(new_today)}** |",
            f"| Updated today | **{len(updated_today)}** |",
            f"| Release blocker candidates | **{len(release_blockers)}** |",
            "",
            "## Priority Issues",
            "",
        ]

        if priority_issues:
            lines.extend(
                [
                    "| Severity | Issue | Category | Owner | Updated | Recommended action |",
                    "| --- | --- | --- | --- | --- | --- |",
                ]
            )
            for item in priority_issues:
                issue = item.issue
                lines.append(
                    f"| **{item.severity.title()}** | {self._issue_link(item)} | "
                    f"`{item.category}` | {self._owners(item)} | "
                    f"{self._format_datetime(issue.updated_at)} | "
                    f"{self._clean_table_text(item.recommended_action)} |"
                )
        else:
            lines.append("- No critical or high severity issues.")

        lines.extend(["", "## Release Blocker Candidates", ""])
        if release_blockers:
            for item in release_blockers:
                lines.append(
                    f"- {self._issue_link(item)} - {item.qa_notes} "
                    f"Next: {item.recommended_action}"
                )
        else:
            lines.append("- No release blocker candidates in this run.")

        lines.extend(["", "## QA Action Items", ""])
        for action in self._action_items():
            lines.append(f"- {action}")

        lines.extend(["", "## Today's Movement", ""])
        lines.extend(
            [
                "| Type | Count | Issues |",
                "| --- | ---: | --- |",
                f"| New today | {len(new_today)} | {self._issue_links(new_today)} |",
                f"| Updated today | {len(updated_today)} | {self._issue_links(updated_today)} |",
            ]
        )

        lines.extend(["", "## Summary", ""])
        lines.extend(
            [
                "| Severity | Count |",
                "| --- | ---: |",
            ]
        )

        for severity in ("critical", "high", "medium", "low"):
            count = self.summary.by_severity.get(severity, 0)
            lines.append(f"| {severity.title()} | {count} |")

        lines.extend(["", "| Category | Count |", "| --- | ---: |"])
        for category, count in sorted(self.summary.by_category.items()):
            lines.append(f"| `{category}` | {count} |")

        lines.extend(["", "## Reviewer Notes", ""])
        if self.findings:
            for finding in self.findings:
                lines.append(f"- **{finding.title}**: {finding.detail}")
        else:
            lines.append("- No additional reviewer notes.")

        lines.extend(["", "## Issue Matrix", ""])
        lines.extend(
            [
                "| Severity | Issue | Category | Labels | Owner | Milestone |",
                "| --- | --- | --- | --- | --- | --- |",
            ]
        )
        for item in self.issues:
            issue = item.issue
            lines.append(
                f"| **{item.severity.title()}** | {self._issue_link(item)} | "
                f"`{item.category}` | {self._labels(item)} | "
                f"{self._owners(item)} | {issue.milestone or '-'} |"
            )

        lines.extend(["", "## Detailed Notes", ""])
        for item in self.issues:
            issue = item.issue
            lines.extend(
                [
                    f"<details>",
                    f"<summary>#{issue.number} {issue.title}</summary>",
                    "",
                    f"- Severity: **{item.severity}**",
                    f"- Category: `{item.category}`",
                    f"- Labels: {self._labels(item)}",
                    f"- Owner: {self._owners(item)}",
                    f"- Milestone: {issue.milestone or '-'}",
                    f"- URL: {issue.url}",
                    f"- QA Notes: {item.qa_notes}",
                    f"- Recommended Action: {item.recommended_action}",
                    "",
                    "</details>",
                    "",
                ]
            )

        return "\n".join(lines).strip() + "\n"

    def _priority_issues(self) -> list[ClassifiedIssue]:
        """Return high-priority issues sorted by severity."""
        order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        priority_issues = [
            item for item in self.issues if item.severity in {"critical", "high"}
        ]
        return sorted(priority_issues, key=lambda item: order[item.severity])

    def _release_blockers(self) -> list[ClassifiedIssue]:
        """Return issues that may block a release."""
        return [
            item
            for item in self.issues
            if item.severity == "critical"
            or "release-blocker" in {label.lower() for label in item.issue.labels}
        ]

    def _action_items(self) -> list[str]:
        """Return concise QA action items for the report."""
        actions: list[str] = []
        for item in self._priority_issues():
            actions.append(f"{self._issue_link(item)}: {item.recommended_action}")

        coverage_gaps = [item for item in self.issues if item.category == "test_gap"]
        if coverage_gaps:
            actions.append(
                "Add or update coverage for "
                f"{self._issue_links(coverage_gaps)} before closing related work."
            )

        flaky_tests = [item for item in self.issues if item.category == "flaky_test"]
        if flaky_tests:
            actions.append(
                "Review flaky test ownership and stabilization plan for "
                f"{self._issue_links(flaky_tests)}."
            )

        return actions or ["No immediate QA action items."]

    def _issues_created_today(self) -> list[ClassifiedIssue]:
        """Return issues created on the report date."""
        return [
            item
            for item in self.issues
            if item.issue.created_at.astimezone(self.generated_at.tzinfo).date()
            == self.generated_at.date()
        ]

    def _issues_updated_today(self) -> list[ClassifiedIssue]:
        """Return issues updated on the report date."""
        return [
            item
            for item in self.issues
            if item.issue.updated_at.astimezone(self.generated_at.tzinfo).date()
            == self.generated_at.date()
        ]

    def _issue_links(self, items: list[ClassifiedIssue]) -> str:
        """Render a compact list of issue links."""
        if not items:
            return "-"
        return ", ".join(self._issue_link(item) for item in items)

    def _issue_link(self, item: ClassifiedIssue) -> str:
        """Render an issue as a Markdown link."""
        issue = item.issue
        return f"[#{issue.number} {self._clean_table_text(issue.title)}]({issue.url})"

    def _labels(self, item: ClassifiedIssue) -> str:
        """Render labels for Markdown tables."""
        return ", ".join(f"`{label}`" for label in item.issue.labels) or "-"

    def _owners(self, item: ClassifiedIssue) -> str:
        """Render assignees or author fallback."""
        return ", ".join(item.issue.assignees) or item.issue.author

    def _format_datetime(self, value: datetime) -> str:
        """Format a datetime in the report timezone."""
        return value.astimezone(self.generated_at.tzinfo).strftime("%m-%d %H:%M")

    def _clean_table_text(self, value: str) -> str:
        """Keep Markdown table cells from breaking on pipe characters."""
        return value.replace("|", "\\|").replace("\n", " ")
