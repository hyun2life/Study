"""Report-related Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from html import escape

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

    def to_html(self) -> str:
        """Render this report as email-friendly HTML."""
        total = self.summary.total_issues
        critical = self.summary.by_severity.get("critical", 0)
        high = self.summary.by_severity.get("high", 0)
        new_today = self._issues_created_today()
        updated_today = self._issues_updated_today()
        release_blockers = self._release_blockers()
        priority_issues = self._priority_issues()

        html = [
            "<!doctype html>",
            '<html lang="en">',
            "<head>",
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            f"<title>{self._html_escape(self.title)}</title>",
            "</head>",
            '<body style="margin:0;background:#f3f6fb;color:#111827;'
            "font-family:Arial,Helvetica,sans-serif;\">",
            '<div style="display:none;max-height:0;overflow:hidden;color:#f3f6fb;">'
            f"{self._html_escape(self.title)} - {total} issue(s), "
            f"{critical} critical, {high} high."
            "</div>",
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="background:#f3f6fb;border-collapse:collapse;">',
            "<tr><td align=\"center\" style=\"padding:24px 12px;\">",
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="max-width:960px;background:#ffffff;border-collapse:collapse;'
            "border:1px solid #d9e2f1;\">",
            '<tr><td style="background:#172033;color:#ffffff;padding:28px 32px;">',
            f'<div style="font-size:26px;font-weight:700;line-height:1.25;">'
            f"{self._html_escape(self.title)}</div>",
            '<div style="font-size:13px;color:#cbd5e1;margin-top:8px;">'
            f"Repository: <strong>{self._html_escape(self.repository)}</strong> "
            f"&nbsp;|&nbsp; Generated: {self._html_escape(self.generated_at.isoformat())}"
            "</div>",
            "</td></tr>",
            '<tr><td style="padding:24px 32px;">',
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="border-collapse:collapse;">',
            "<tr>",
            self._html_metric_card("Total Issues", str(total), "#2563eb"),
            self._html_metric_card("Critical / High", f"{critical} / {high}", "#dc2626"),
            self._html_metric_card("Release Blockers", str(len(release_blockers)), "#b42318"),
            "</tr><tr>",
            self._html_metric_card("New Today", str(len(new_today)), "#059669"),
            self._html_metric_card("Updated Today", str(len(updated_today)), "#7c3aed"),
            self._html_metric_card(
                "Test Gaps",
                str(self.summary.by_category.get("test_gap", 0)),
                "#ea580c",
            ),
            "</tr>",
            "</table>",
            "</td></tr>",
        ]

        html.append(
            self._html_section(
                "Priority Issues",
                self._html_priority_table(priority_issues)
                if priority_issues
                else self._html_empty("No critical or high severity issues."),
            )
        )

        html.append(
            self._html_section(
                "Release Blocker Candidates",
                self._html_release_blockers(release_blockers),
            )
        )
        html.append(self._html_section("QA Action Items", self._html_action_items()))
        html.append(
            self._html_section(
                "Today's Movement",
                self._html_table(
                    ["Type", "Count", "Issues"],
                    [
                        ["New today", str(len(new_today)), self._html_issue_links(new_today)],
                        [
                            "Updated today",
                            str(len(updated_today)),
                            self._html_issue_links(updated_today),
                        ],
                    ],
                ),
            )
        )
        html.append(self._html_section("Summary", self._html_summary_tables()))
        html.append(self._html_section("Reviewer Notes", self._html_reviewer_notes()))
        html.append(self._html_section("Issue Matrix", self._html_issue_matrix()))
        html.append(self._html_section("Detailed Notes", self._html_detail_cards()))

        html.extend(
            [
                '<tr><td style="padding:18px 32px 28px;color:#64748b;'
                'font-size:12px;border-top:1px solid #e5e7eb;">',
                "Generated from mock QA issue data. Real GitHub, OpenAI, and messenger "
                "integrations are not enabled in this build.",
                "</td></tr>",
                "</table>",
                "</td></tr>",
                "</table>",
                "</body></html>",
            ]
        )
        return "".join(html)

    def _priority_issues(self) -> list[ClassifiedIssue]:
        """Return high-priority issues sorted by severity."""
        order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
        priority_issues = [
            item for item in self.issues if item.severity in {"critical", "high"}
        ]
        return sorted(priority_issues, key=lambda item: order[item.severity])

    def _html_metric_card(self, label: str, value: str, color: str) -> str:
        """Render a compact HTML metric card."""
        return (
            '<td width="33.33%" style="padding:6px;">'
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;">'
            '<tr><td style="padding:16px;border-left:4px solid '
            f"{color};\">"
            f'<div style="font-size:12px;color:#64748b;text-transform:uppercase;'
            f'letter-spacing:.04em;">{self._html_escape(label)}</div>'
            f'<div style="font-size:24px;font-weight:700;color:#111827;margin-top:6px;">'
            f"{self._html_escape(value)}</div>"
            "</td></tr></table></td>"
        )

    def _html_section(self, title: str, body: str) -> str:
        """Wrap a report section for email HTML."""
        return (
            '<tr><td style="padding:6px 32px 22px;">'
            f'<h2 style="margin:0 0 12px;font-size:18px;line-height:1.3;'
            f'color:#172033;">{self._html_escape(title)}</h2>'
            f"{body}"
            "</td></tr>"
        )

    def _html_priority_table(self, issues: list[ClassifiedIssue]) -> str:
        """Render priority issues as an HTML table."""
        rows = []
        for item in issues:
            issue = item.issue
            rows.append(
                [
                    self._html_severity_badge(item.severity),
                    self._html_issue_link(item),
                    self._html_category_badge(item.category),
                    self._html_escape(self._owners(item)),
                    self._html_escape(self._format_datetime(issue.updated_at)),
                    self._html_escape(item.recommended_action),
                ]
            )
        return self._html_table(
            ["Severity", "Issue", "Category", "Owner", "Updated", "Recommended action"],
            rows,
        )

    def _html_release_blockers(self, issues: list[ClassifiedIssue]) -> str:
        """Render release blocker candidates."""
        if not issues:
            return self._html_empty("No release blocker candidates in this run.")

        rows = []
        for item in issues:
            rows.append(
                [
                    self._html_issue_link(item),
                    self._html_escape(item.qa_notes),
                    self._html_escape(item.recommended_action),
                ]
            )
        return self._html_table(["Issue", "QA note", "Next action"], rows)

    def _html_action_items(self) -> str:
        """Render action items as HTML bullets."""
        items = []
        for item in self._priority_issues():
            items.append(
                f"{self._html_issue_link(item)}: {self._html_escape(item.recommended_action)}"
            )

        coverage_gaps = [item for item in self.issues if item.category == "test_gap"]
        if coverage_gaps:
            items.append(
                "Add or update coverage for "
                f"{self._html_issue_links(coverage_gaps)} before closing related work."
            )

        flaky_tests = [item for item in self.issues if item.category == "flaky_test"]
        if flaky_tests:
            items.append(
                "Review flaky test ownership and stabilization plan for "
                f"{self._html_issue_links(flaky_tests)}."
            )

        if not items:
            items = ["No immediate QA action items."]

        return (
            '<ul style="margin:0;padding:0 0 0 20px;color:#334155;line-height:1.55;">'
            + "".join(f'<li style="margin:0 0 8px;">{item}</li>' for item in items)
            + "</ul>"
        )

    def _html_summary_tables(self) -> str:
        """Render severity and category summary tables."""
        severity_rows = [
            [
                self._html_severity_badge(severity),
                str(self.summary.by_severity.get(severity, 0)),
            ]
            for severity in ("critical", "high", "medium", "low")
        ]
        category_rows = [
            [self._html_category_badge(category), str(count)]
            for category, count in sorted(self.summary.by_category.items())
        ]
        return (
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="border-collapse:collapse;"><tr>'
            f'<td width="50%" valign="top" style="padding-right:8px;">'
            f'{self._html_table(["Severity", "Count"], severity_rows)}</td>'
            f'<td width="50%" valign="top" style="padding-left:8px;">'
            f'{self._html_table(["Category", "Count"], category_rows)}</td>'
            "</tr></table>"
        )

    def _html_reviewer_notes(self) -> str:
        """Render reviewer findings."""
        if not self.findings:
            return self._html_empty("No additional reviewer notes.")
        return "".join(
            '<div style="margin:0 0 10px;padding:12px 14px;background:#f8fafc;'
            'border:1px solid #e2e8f0;">'
            f'<strong style="color:#172033;">{self._html_escape(finding.title)}</strong>'
            f'<div style="margin-top:4px;color:#334155;line-height:1.5;">'
            f"{self._html_escape(finding.detail)}</div></div>"
            for finding in self.findings
        )

    def _html_issue_matrix(self) -> str:
        """Render the full issue matrix."""
        rows = []
        for item in self.issues:
            issue = item.issue
            rows.append(
                [
                    self._html_severity_badge(item.severity),
                    self._html_issue_link(item),
                    self._html_category_badge(item.category),
                    self._html_labels(item),
                    self._html_escape(self._owners(item)),
                    self._html_escape(issue.milestone or "-"),
                ]
            )
        return self._html_table(
            ["Severity", "Issue", "Category", "Labels", "Owner", "Milestone"],
            rows,
        )

    def _html_detail_cards(self) -> str:
        """Render detailed issue notes as email-safe cards."""
        cards = []
        for item in self.issues:
            issue = item.issue
            cards.append(
                '<div style="margin:0 0 12px;border:1px solid #e2e8f0;'
                'background:#ffffff;">'
                '<div style="padding:12px 14px;background:#f8fafc;'
                'border-bottom:1px solid #e2e8f0;font-weight:700;color:#172033;">'
                f"#{issue.number} {self._html_escape(issue.title)}</div>"
                '<div style="padding:14px;color:#334155;line-height:1.55;">'
                f"<div>Severity: {self._html_severity_badge(item.severity)}</div>"
                f"<div>Category: {self._html_category_badge(item.category)}</div>"
                f"<div>Labels: {self._html_labels(item)}</div>"
                f"<div>Owner: {self._html_escape(self._owners(item))}</div>"
                f"<div>Milestone: {self._html_escape(issue.milestone or '-')}</div>"
                f'<div>URL: {self._html_issue_link(item)}</div>'
                f"<div>QA Notes: {self._html_escape(item.qa_notes)}</div>"
                f"<div>Recommended Action: {self._html_escape(item.recommended_action)}</div>"
                "</div></div>"
            )
        return "".join(cards)

    def _html_table(self, headers: list[str], rows: list[list[str]]) -> str:
        """Render an email-friendly table."""
        header_html = "".join(
            '<th align="left" style="padding:10px 12px;background:#edf2f7;'
            'border:1px solid #dbe4f0;color:#334155;font-size:12px;'
            f'text-transform:uppercase;">{self._html_escape(header)}</th>'
            for header in headers
        )
        row_html = []
        for row in rows:
            cells = "".join(
                '<td valign="top" style="padding:10px 12px;border:1px solid #e2e8f0;'
                f'font-size:13px;line-height:1.45;color:#334155;">{cell}</td>'
                for cell in row
            )
            row_html.append(f"<tr>{cells}</tr>")

        return (
            '<table width="100%" cellspacing="0" cellpadding="0" '
            'style="border-collapse:collapse;background:#ffffff;">'
            f"<tr>{header_html}</tr>{''.join(row_html)}</table>"
        )

    def _html_empty(self, message: str) -> str:
        """Render an empty-state line."""
        return (
            '<div style="padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;'
            f'color:#64748b;">{self._html_escape(message)}</div>'
        )

    def _html_issue_links(self, items: list[ClassifiedIssue]) -> str:
        """Render compact HTML issue links."""
        if not items:
            return "-"
        return ", ".join(self._html_issue_link(item) for item in items)

    def _html_issue_link(self, item: ClassifiedIssue) -> str:
        """Render an issue as an HTML link."""
        issue = item.issue
        return (
            f'<a href="{self._html_escape(str(issue.url))}" '
            'style="color:#2563eb;text-decoration:none;">'
            f"#{issue.number} {self._html_escape(issue.title)}</a>"
        )

    def _html_labels(self, item: ClassifiedIssue) -> str:
        """Render labels as small HTML chips."""
        if not item.issue.labels:
            return "-"
        return " ".join(
            '<span style="display:inline-block;margin:0 4px 4px 0;padding:2px 6px;'
            'background:#f1f5f9;border:1px solid #cbd5e1;color:#334155;'
            f'font-size:12px;">{self._html_escape(label)}</span>'
            for label in item.issue.labels
        )

    def _html_severity_badge(self, severity: Severity) -> str:
        """Render a colored severity badge."""
        colors = {
            "critical": ("#fee2e2", "#b42318"),
            "high": ("#ffedd5", "#c2410c"),
            "medium": ("#dbeafe", "#1d4ed8"),
            "low": ("#dcfce7", "#15803d"),
        }
        background, color = colors[severity]
        return (
            '<span style="display:inline-block;padding:4px 8px;'
            f'background:{background};color:{color};font-weight:700;'
            f'font-size:12px;">{self._html_escape(severity.title())}</span>'
        )

    def _html_category_badge(self, category: QaCategory) -> str:
        """Render a category badge."""
        return (
            '<span style="display:inline-block;padding:4px 8px;background:#eef2ff;'
            f'color:#3730a3;font-size:12px;">{self._html_escape(category)}</span>'
        )

    def _html_escape(self, value: object) -> str:
        """Escape text for HTML output."""
        return escape(str(value), quote=True)

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
