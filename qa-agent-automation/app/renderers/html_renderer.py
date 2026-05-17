"""Email-friendly HTML renderer for QA reports."""

from __future__ import annotations

from app.renderers.base import BaseReportRenderer
from app.schemas.issue import ClassifiedIssue, QaCategory, Severity
from app.schemas.report import QaReport


class HtmlReportRenderer(BaseReportRenderer):
    """Render QA reports as English or Korean email HTML."""

    def __init__(self, language: str = "en") -> None:
        self.language = language

    def render(self, report: QaReport) -> str:
        """Render a report as email-friendly HTML."""
        is_ko = self.language == "ko"
        labels = self._ui_labels(is_ko)
        title = "QA 데일리 리포트" if is_ko else report.title
        total = report.summary.total_issues
        critical = report.summary.by_severity.get("critical", 0)
        high = report.summary.by_severity.get("high", 0)
        new_today = self.issues_created_today(report)
        updated_today = self.issues_updated_today(report)
        release_blockers = self.release_blockers(report)
        priority_issues = self.priority_issues(report)

        html = [
            "<!doctype html>",
            f'<html lang="{"ko" if is_ko else "en"}">',
            "<head>",
            '<meta charset="utf-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1">',
            f"<title>{self.html_escape(title)}</title>",
            "</head>",
            '<body style="margin:0;background:#f3f6fb;color:#111827;'
            "font-family:Arial,Helvetica,sans-serif;\">",
            '<div style="display:none;max-height:0;overflow:hidden;color:#f3f6fb;">'
            f"{self.html_escape(title)} - {total} issue(s), {critical} critical, "
            f"{high} high.</div>",
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="background:#f3f6fb;border-collapse:collapse;">',
            '<tr><td align="center" style="padding:24px 12px;">',
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="max-width:960px;background:#ffffff;border-collapse:collapse;'
            'border:1px solid #d9e2f1;">',
            '<tr><td style="background:#172033;color:#ffffff;padding:28px 32px;">',
            f'<div style="font-size:26px;font-weight:700;line-height:1.25;">'
            f"{self.html_escape(title)}</div>",
            '<div style="font-size:13px;color:#cbd5e1;margin-top:8px;">'
            f"{labels['repository']}: <strong>{self.html_escape(report.repository)}</strong> "
            f"&nbsp;|&nbsp; {labels['generated']}: "
            f"{self.html_escape(report.generated_at.isoformat())}</div>",
            "</td></tr>",
            '<tr><td style="padding:24px 32px;">',
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="border-collapse:collapse;">',
            "<tr>",
            self._metric_card(labels["total"], str(total), "#2563eb"),
            self._metric_card("Critical / High", f"{critical} / {high}", "#dc2626"),
            self._metric_card(labels["blockers"], str(len(release_blockers)), "#b42318"),
            "</tr><tr>",
            self._metric_card(labels["new"], str(len(new_today)), "#059669"),
            self._metric_card(labels["updated"], str(len(updated_today)), "#7c3aed"),
            self._metric_card(
                labels["test_gaps"],
                str(report.summary.by_category.get("test_gap", 0)),
                "#ea580c",
            ),
            "</tr></table></td></tr>",
        ]

        html.append(
            self._section(
                labels["priority"],
                self._priority_table(report, priority_issues, is_ko)
                if priority_issues
                else self._empty(labels["no_priority"]),
            )
        )
        html.append(
            self._section(
                labels["blocker_section"],
                self._release_blockers_table(release_blockers, is_ko),
            )
        )
        html.append(self._section(labels["actions"], self._action_items_html(report, is_ko)))
        html.append(
            self._section(
                labels["movement"],
                self._table(
                    [labels["type"], labels["count"], labels["issues"]],
                    [
                        [
                            labels["new"],
                            str(len(new_today)),
                            self._issue_links_html(new_today, is_ko),
                        ],
                        [
                            labels["updated"],
                            str(len(updated_today)),
                            self._issue_links_html(updated_today, is_ko),
                        ],
                    ],
                ),
            )
        )
        html.append(self._section(labels["summary"], self._summary_tables(report, is_ko)))
        html.append(self._section(labels["reviewer_notes"], self._reviewer_notes(report, is_ko)))
        html.append(self._section(labels["matrix"], self._issue_matrix(report, is_ko)))
        html.append(self._section(labels["details"], self._detail_cards(report, is_ko)))

        footer = (
            "이 리포트는 mock QA 이슈 데이터를 기반으로 생성되었습니다. 현재 빌드에서는 "
            "실제 GitHub, OpenAI, 메신저 연동을 사용하지 않습니다."
            if is_ko
            else "Generated from mock QA issue data. Real GitHub, OpenAI, and "
            "messenger integrations are not enabled in this build."
        )
        html.extend(
            [
                '<tr><td style="padding:18px 32px 28px;color:#64748b;'
                'font-size:12px;border-top:1px solid #e5e7eb;">',
                footer,
                "</td></tr></table></td></tr></table></body></html>",
            ]
        )
        return "".join(html)

    def _ui_labels(self, is_ko: bool) -> dict[str, str]:
        """Return translated UI labels."""
        if is_ko:
            return {
                "repository": "저장소",
                "generated": "생성 시간",
                "total": "전체 이슈",
                "blockers": "릴리즈 블로커 후보",
                "new": "오늘 생성",
                "updated": "오늘 업데이트",
                "test_gaps": "테스트 갭",
                "priority": "우선 확인 이슈",
                "blocker_section": "릴리즈 블로커 후보",
                "actions": "QA 액션 아이템",
                "movement": "오늘의 변동",
                "summary": "요약",
                "reviewer_notes": "리뷰어 노트",
                "matrix": "이슈 매트릭스",
                "details": "상세 노트",
                "no_priority": "Critical 또는 High 이슈가 없습니다.",
                "no_blockers": "이번 리포트에는 릴리즈 블로커 후보가 없습니다.",
                "type": "구분",
                "count": "건수",
                "issues": "이슈",
            }
        return {
            "repository": "Repository",
            "generated": "Generated",
            "total": "Total Issues",
            "blockers": "Release Blockers",
            "new": "New Today",
            "updated": "Updated Today",
            "test_gaps": "Test Gaps",
            "priority": "Priority Issues",
            "blocker_section": "Release Blocker Candidates",
            "actions": "QA Action Items",
            "movement": "Today's Movement",
            "summary": "Summary",
            "reviewer_notes": "Reviewer Notes",
            "matrix": "Issue Matrix",
            "details": "Detailed Notes",
            "no_priority": "No critical or high severity issues.",
            "no_blockers": "No release blocker candidates in this run.",
            "type": "Type",
            "count": "Count",
            "issues": "Issues",
        }

    def _metric_card(self, label: str, value: str, color: str) -> str:
        """Render a compact HTML metric card."""
        return (
            '<td width="33.33%" style="padding:6px;">'
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="border-collapse:collapse;background:#f8fafc;border:1px solid #e2e8f0;">'
            f'<tr><td style="padding:16px;border-left:4px solid {color};">'
            '<div style="font-size:12px;color:#64748b;text-transform:uppercase;'
            f'letter-spacing:.04em;">{self.html_escape(label)}</div>'
            '<div style="font-size:24px;font-weight:700;color:#111827;margin-top:6px;">'
            f"{self.html_escape(value)}</div></td></tr></table></td>"
        )

    def _section(self, title: str, body: str) -> str:
        """Wrap a report section for email HTML."""
        return (
            '<tr><td style="padding:6px 32px 22px;">'
            '<h2 style="margin:0 0 12px;font-size:18px;line-height:1.3;color:#172033;">'
            f"{self.html_escape(title)}</h2>{body}</td></tr>"
        )

    def _priority_table(
        self, report: QaReport, issues: list[ClassifiedIssue], is_ko: bool
    ) -> str:
        """Render priority issues as an HTML table."""
        rows = []
        for item in issues:
            rows.append(
                [
                    self._severity_badge(item.severity, is_ko),
                    self._issue_link(item, is_ko),
                    self._category_badge(item.category, is_ko),
                    self.html_escape(self.owners(item)),
                    self.html_escape(self.format_datetime(item.issue.updated_at, report)),
                    self.html_escape(
                        self.ko_recommended_action(item)
                        if is_ko
                        else item.recommended_action
                    ),
                ]
            )
        headers = (
            ["심각도", "이슈", "분류", "담당자", "업데이트", "권장 조치"]
            if is_ko
            else ["Severity", "Issue", "Category", "Owner", "Updated", "Recommended action"]
        )
        return self._table(headers, rows)

    def _release_blockers_table(
        self, issues: list[ClassifiedIssue], is_ko: bool
    ) -> str:
        """Render release blocker candidates."""
        if not issues:
            return self._empty(self._ui_labels(is_ko)["no_blockers"])
        rows = []
        for item in issues:
            rows.append(
                [
                    self._issue_link(item, is_ko),
                    self.html_escape(self.ko_qa_note(item) if is_ko else item.qa_notes),
                    self.html_escape(
                        self.ko_recommended_action(item)
                        if is_ko
                        else item.recommended_action
                    ),
                ]
            )
        return self._table(["이슈", "QA 메모", "다음 조치"] if is_ko else ["Issue", "QA note", "Next action"], rows)

    def _action_items_html(self, report: QaReport, is_ko: bool) -> str:
        """Render action items as HTML bullets."""
        items: list[str] = []
        for item in self.priority_issues(report):
            action = self.ko_recommended_action(item) if is_ko else item.recommended_action
            items.append(f"{self._issue_link(item, is_ko)}: {self.html_escape(action)}")

        coverage_gaps = [item for item in report.issues if item.category == "test_gap"]
        if coverage_gaps:
            if is_ko:
                items.append(
                    f"{self._issue_links_html(coverage_gaps, True)} 관련 작업을 닫기 전에 "
                    "테스트 커버리지를 보강하세요."
                )
            else:
                items.append(
                    "Add or update coverage for "
                    f"{self._issue_links_html(coverage_gaps, False)} before closing related work."
                )

        flaky_tests = [item for item in report.issues if item.category == "flaky_test"]
        if flaky_tests:
            if is_ko:
                items.append(
                    f"{self._issue_links_html(flaky_tests, True)}의 불안정 테스트 담당자와 "
                    "안정화 계획을 확인하세요."
                )
            else:
                items.append(
                    "Review flaky test ownership and stabilization plan for "
                    f"{self._issue_links_html(flaky_tests, False)}."
                )

        if not items:
            items = ["즉시 처리해야 할 QA 액션 아이템이 없습니다." if is_ko else "No immediate QA action items."]

        return (
            '<ul style="margin:0;padding:0 0 0 20px;color:#334155;line-height:1.55;">'
            + "".join(f'<li style="margin:0 0 8px;">{item}</li>' for item in items)
            + "</ul>"
        )

    def _summary_tables(self, report: QaReport, is_ko: bool) -> str:
        """Render severity and category summary tables."""
        severity_rows = [
            [self._severity_badge(severity, is_ko), str(report.summary.by_severity.get(severity, 0))]
            for severity in ("critical", "high", "medium", "low")
        ]
        category_rows = [
            [self._category_badge(category, is_ko), str(count)]
            for category, count in sorted(report.summary.by_category.items())
        ]
        severity_headers = ["심각도", "건수"] if is_ko else ["Severity", "Count"]
        category_headers = ["분류", "건수"] if is_ko else ["Category", "Count"]
        return (
            '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" '
            'style="border-collapse:collapse;"><tr>'
            f'<td width="50%" valign="top" style="padding-right:8px;">'
            f'{self._table(severity_headers, severity_rows)}</td>'
            f'<td width="50%" valign="top" style="padding-left:8px;">'
            f'{self._table(category_headers, category_rows)}</td></tr></table>'
        )

    def _reviewer_notes(self, report: QaReport, is_ko: bool) -> str:
        """Render reviewer findings."""
        if not report.findings:
            return self._empty("추가 리뷰어 노트가 없습니다." if is_ko else "No additional reviewer notes.")
        cards = []
        for finding in report.findings:
            title = self.ko_finding_title(finding.title) if is_ko else finding.title
            detail = self.ko_finding_detail(finding.detail) if is_ko else finding.detail
            cards.append(
                '<div style="margin:0 0 10px;padding:12px 14px;background:#f8fafc;'
                'border:1px solid #e2e8f0;">'
                f'<strong style="color:#172033;">{self.html_escape(title)}</strong>'
                '<div style="margin-top:4px;color:#334155;line-height:1.5;">'
                f"{self.html_escape(detail)}</div></div>"
            )
        return "".join(cards)

    def _issue_matrix(self, report: QaReport, is_ko: bool) -> str:
        """Render the full issue matrix."""
        rows = []
        for item in report.issues:
            rows.append(
                [
                    self._severity_badge(item.severity, is_ko),
                    self._issue_link(item, is_ko),
                    self._category_badge(item.category, is_ko),
                    self._labels(item),
                    self.html_escape(self.owners(item)),
                    self.html_escape(item.issue.milestone or "-"),
                ]
            )
        headers = (
            ["심각도", "이슈", "분류", "라벨", "담당자", "마일스톤"]
            if is_ko
            else ["Severity", "Issue", "Category", "Labels", "Owner", "Milestone"]
        )
        return self._table(headers, rows)

    def _detail_cards(self, report: QaReport, is_ko: bool) -> str:
        """Render detailed issue notes as email-safe cards."""
        cards = []
        for item in report.issues:
            title = self.issue_title(item, "ko" if is_ko else "en")
            severity_label = "심각도" if is_ko else "Severity"
            category_label = "분류" if is_ko else "Category"
            labels_label = "라벨" if is_ko else "Labels"
            owner_label = "담당자" if is_ko else "Owner"
            milestone_label = "마일스톤" if is_ko else "Milestone"
            note_label = "QA 메모" if is_ko else "QA Notes"
            action_label = "권장 조치" if is_ko else "Recommended Action"
            qa_note = self.ko_qa_note(item) if is_ko else item.qa_notes
            action = self.ko_recommended_action(item) if is_ko else item.recommended_action
            cards.append(
                '<div style="margin:0 0 12px;border:1px solid #e2e8f0;background:#ffffff;">'
                '<div style="padding:12px 14px;background:#f8fafc;border-bottom:1px solid #e2e8f0;'
                f'font-weight:700;color:#172033;">#{item.issue.number} {self.html_escape(title)}</div>'
                '<div style="padding:14px;color:#334155;line-height:1.55;">'
                f"<div>{severity_label}: {self._severity_badge(item.severity, is_ko)}</div>"
                f"<div>{category_label}: {self._category_badge(item.category, is_ko)}</div>"
                f"<div>{labels_label}: {self._labels(item)}</div>"
                f"<div>{owner_label}: {self.html_escape(self.owners(item))}</div>"
                f"<div>{milestone_label}: {self.html_escape(item.issue.milestone or '-')}</div>"
                f"<div>URL: {self._issue_link(item, is_ko)}</div>"
                f"<div>{note_label}: {self.html_escape(qa_note)}</div>"
                f"<div>{action_label}: {self.html_escape(action)}</div>"
                "</div></div>"
            )
        return "".join(cards)

    def _table(self, headers: list[str], rows: list[list[str]]) -> str:
        """Render an email-friendly table."""
        header_html = "".join(
            '<th align="left" style="padding:10px 12px;background:#edf2f7;'
            'border:1px solid #dbe4f0;color:#334155;font-size:12px;'
            f'text-transform:uppercase;">{self.html_escape(header)}</th>'
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
            f'style="border-collapse:collapse;background:#ffffff;"><tr>{header_html}</tr>'
            f"{''.join(row_html)}</table>"
        )

    def _empty(self, message: str) -> str:
        """Render an empty-state line."""
        return (
            '<div style="padding:12px 14px;background:#f8fafc;border:1px solid #e2e8f0;'
            f'color:#64748b;">{self.html_escape(message)}</div>'
        )

    def _issue_links_html(self, items: list[ClassifiedIssue], is_ko: bool) -> str:
        """Render compact HTML issue links."""
        if not items:
            return "-"
        return ", ".join(self._issue_link(item, is_ko) for item in items)

    def _issue_link(self, item: ClassifiedIssue, is_ko: bool) -> str:
        """Render an issue as an HTML link."""
        title = self.issue_title(item, "ko" if is_ko else "en")
        return (
            f'<a href="{self.html_escape(str(item.issue.url))}" '
            'style="color:#2563eb;text-decoration:none;">'
            f"#{item.issue.number} {self.html_escape(title)}</a>"
        )

    def _labels(self, item: ClassifiedIssue) -> str:
        """Render labels as small HTML chips."""
        if not item.issue.labels:
            return "-"
        return " ".join(
            '<span style="display:inline-block;margin:0 4px 4px 0;padding:2px 6px;'
            'background:#f1f5f9;border:1px solid #cbd5e1;color:#334155;'
            f'font-size:12px;">{self.html_escape(label)}</span>'
            for label in item.issue.labels
        )

    def _severity_badge(self, severity: Severity, is_ko: bool) -> str:
        """Render a colored severity badge."""
        colors = {
            "critical": ("#fee2e2", "#b42318"),
            "high": ("#ffedd5", "#c2410c"),
            "medium": ("#dbeafe", "#1d4ed8"),
            "low": ("#dcfce7", "#15803d"),
        }
        background, color = colors[severity]
        label = self.ko_severity(severity) if is_ko else severity.title()
        return (
            '<span style="display:inline-block;padding:4px 8px;'
            f'background:{background};color:{color};font-weight:700;font-size:12px;">'
            f"{self.html_escape(label)}</span>"
        )

    def _category_badge(self, category: QaCategory, is_ko: bool) -> str:
        """Render a category badge."""
        label = self.ko_category(category) if is_ko else category
        return (
            '<span style="display:inline-block;padding:4px 8px;background:#eef2ff;'
            f'color:#3730a3;font-size:12px;">{self.html_escape(label)}</span>'
        )
