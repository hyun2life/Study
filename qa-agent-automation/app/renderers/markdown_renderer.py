"""Markdown renderer for QA reports."""

from __future__ import annotations

from app.renderers.base import BaseReportRenderer
from app.schemas.report import QaReport


class MarkdownReportRenderer(BaseReportRenderer):
    """Render QA reports as Markdown."""

    def render(self, report: QaReport) -> str:
        """Render a report as Markdown."""
        total = report.summary.total_issues
        critical = report.summary.by_severity.get("critical", 0)
        high = report.summary.by_severity.get("high", 0)
        new_today = self.issues_created_today(report)
        updated_today = self.issues_updated_today(report)
        release_blockers = self.release_blockers(report)
        priority_issues = self.priority_issues(report)

        lines = [
            f"# {report.title}",
            "",
            "| Field | Value |",
            "| --- | --- |",
            f"| Repository | `{report.repository}` |",
            f"| Generated at | `{report.generated_at.isoformat()}` |",
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
                lines.append(
                    f"| **{item.severity.title()}** | {self.issue_link_markdown(item)} | "
                    f"`{item.category}` | {self.owners(item)} | "
                    f"{self.format_datetime(item.issue.updated_at, report)} | "
                    f"{self.clean_table_text(item.recommended_action)} |"
                )
        else:
            lines.append("- No critical or high severity issues.")

        lines.extend(["", "## Release Blocker Candidates", ""])
        if release_blockers:
            for item in release_blockers:
                lines.append(
                    f"- {self.issue_link_markdown(item)} - {item.qa_notes} "
                    f"Next: {item.recommended_action}"
                )
        else:
            lines.append("- No release blocker candidates in this run.")

        lines.extend(["", "## QA Action Items", ""])
        for action in self.action_items(report):
            lines.append(f"- {action}")

        lines.extend(["", "## Today's Movement", ""])
        lines.extend(
            [
                "| Type | Count | Issues |",
                "| --- | ---: | --- |",
                f"| New today | {len(new_today)} | {self.issue_links_markdown(new_today)} |",
                f"| Updated today | {len(updated_today)} | {self.issue_links_markdown(updated_today)} |",
            ]
        )

        lines.extend(["", "## Summary", ""])
        lines.extend(["| Severity | Count |", "| --- | ---: |"])
        for severity in ("critical", "high", "medium", "low"):
            count = report.summary.by_severity.get(severity, 0)
            lines.append(f"| {severity.title()} | {count} |")

        lines.extend(["", "| Category | Count |", "| --- | ---: |"])
        for category, count in sorted(report.summary.by_category.items()):
            lines.append(f"| `{category}` | {count} |")

        lines.extend(["", "## Reviewer Notes", ""])
        if report.findings:
            for finding in report.findings:
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
        for item in report.issues:
            issue = item.issue
            lines.append(
                f"| **{item.severity.title()}** | {self.issue_link_markdown(item)} | "
                f"`{item.category}` | {self.labels_markdown(item)} | "
                f"{self.owners(item)} | {issue.milestone or '-'} |"
            )

        lines.extend(["", "## Detailed Notes", ""])
        for item in report.issues:
            issue = item.issue
            lines.extend(
                [
                    "<details>",
                    f"<summary>#{issue.number} {issue.title}</summary>",
                    "",
                    f"- Severity: **{item.severity}**",
                    f"- Category: `{item.category}`",
                    f"- Labels: {self.labels_markdown(item)}",
                    f"- Owner: {self.owners(item)}",
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
