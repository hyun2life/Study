"""Shared helpers for report renderers."""

from __future__ import annotations

from datetime import datetime
from html import escape
from typing import TYPE_CHECKING

from app.schemas.issue import ClassifiedIssue, QaCategory, Severity

if TYPE_CHECKING:
    from app.schemas.report import QaReport, ReviewFinding


class BaseReportRenderer:
    """Common report rendering helpers."""

    severity_order: dict[Severity, int] = {
        "critical": 0,
        "high": 1,
        "medium": 2,
        "low": 3,
    }

    ko_issue_titles = {
        31: "만료된 쿠폰 적용 시 결제 화면 크래시",
        32: "회귀: 로그인 리다이렉트가 원래 URL을 잃어버림",
        33: "비밀번호 재설정 토큰 만료 테스트 추가",
        34: "CI에서 검색 결과 정렬 테스트가 간헐적으로 실패",
        35: "릴리즈 체크리스트 문서 업데이트",
        36: "모바일 결제 모달이 작은 화면에서 잘림",
        37: "구독 업그레이드 플로우 탐색 테스트 체크리스트 추가",
        38: "검색 실패 빈 상태 문구 개선",
    }

    def priority_issues(self, report: "QaReport") -> list[ClassifiedIssue]:
        """Return critical and high issues sorted by severity."""
        issues = [item for item in report.issues if item.severity in {"critical", "high"}]
        return sorted(issues, key=lambda item: self.severity_order[item.severity])

    def release_blockers(self, report: "QaReport") -> list[ClassifiedIssue]:
        """Return issues that may block a release."""
        return [
            item
            for item in report.issues
            if item.severity == "critical"
            or "release-blocker" in {label.lower() for label in item.issue.labels}
        ]

    def issues_created_today(self, report: "QaReport") -> list[ClassifiedIssue]:
        """Return issues created on the report date."""
        return [
            item
            for item in report.issues
            if item.issue.created_at.astimezone(report.generated_at.tzinfo).date()
            == report.generated_at.date()
        ]

    def issues_updated_today(self, report: "QaReport") -> list[ClassifiedIssue]:
        """Return issues updated on the report date."""
        return [
            item
            for item in report.issues
            if item.issue.updated_at.astimezone(report.generated_at.tzinfo).date()
            == report.generated_at.date()
        ]

    def owners(self, item: ClassifiedIssue) -> str:
        """Render assignees or author fallback."""
        return ", ".join(item.issue.assignees) or item.issue.author

    def labels_markdown(self, item: ClassifiedIssue) -> str:
        """Render labels for Markdown tables."""
        return ", ".join(f"`{label}`" for label in item.issue.labels) or "-"

    def format_datetime(self, value: datetime, report: "QaReport") -> str:
        """Format a datetime in the report timezone."""
        return value.astimezone(report.generated_at.tzinfo).strftime("%m-%d %H:%M")

    def clean_table_text(self, value: str) -> str:
        """Keep Markdown table cells from breaking on pipe characters."""
        return value.replace("|", "\\|").replace("\n", " ")

    def issue_title(self, item: ClassifiedIssue, language: str = "en") -> str:
        """Return an issue title in the requested language."""
        if language == "ko":
            return self.ko_issue_titles.get(item.issue.number, item.issue.title)
        return item.issue.title

    def issue_link_markdown(self, item: ClassifiedIssue, language: str = "en") -> str:
        """Render an issue as a Markdown link."""
        title = self.clean_table_text(self.issue_title(item, language))
        return f"[#{item.issue.number} {title}]({item.issue.url})"

    def issue_links_markdown(
        self, items: list[ClassifiedIssue], language: str = "en"
    ) -> str:
        """Render a compact list of issue links."""
        if not items:
            return "-"
        return ", ".join(self.issue_link_markdown(item, language) for item in items)

    def action_items(self, report: "QaReport") -> list[str]:
        """Return concise English QA action items."""
        actions = [
            f"{self.issue_link_markdown(item)}: {item.recommended_action}"
            for item in self.priority_issues(report)
        ]

        coverage_gaps = [item for item in report.issues if item.category == "test_gap"]
        if coverage_gaps:
            actions.append(
                "Add or update coverage for "
                f"{self.issue_links_markdown(coverage_gaps)} before closing related work."
            )

        flaky_tests = [item for item in report.issues if item.category == "flaky_test"]
        if flaky_tests:
            actions.append(
                "Review flaky test ownership and stabilization plan for "
                f"{self.issue_links_markdown(flaky_tests)}."
            )

        return actions or ["No immediate QA action items."]

    def ko_severity(self, severity: Severity) -> str:
        """Translate severity labels to Korean."""
        return {
            "critical": "긴급",
            "high": "높음",
            "medium": "보통",
            "low": "낮음",
        }[severity]

    def ko_category(self, category: QaCategory) -> str:
        """Translate QA category labels to Korean."""
        return {
            "bug": "버그",
            "regression": "회귀",
            "test_gap": "테스트 갭",
            "flaky_test": "불안정 테스트",
            "documentation": "문서",
            "enhancement": "개선",
            "unknown": "미분류",
        }[category]

    def ko_qa_note(self, item: ClassifiedIssue) -> str:
        """Return a Korean QA note."""
        if item.severity == "critical":
            return "릴리즈 차단 가능성이 있습니다. 재현 절차와 영향 범위를 먼저 확인하세요."
        if item.category == "regression":
            return "회귀 위험이 감지되었습니다. 마지막 정상 빌드와 동작을 비교하세요."
        if item.category == "test_gap":
            return "테스트 커버리지 공백이 있습니다. 누락된 경로에 검증을 추가하세요."
        if item.category == "flaky_test":
            return "테스트 안정성 위험이 있습니다. 환경 의존성을 분리해 확인하세요."
        return "QA 트리아지 큐에서 추적하고 다음 검증 패스에서 확인하세요."

    def ko_recommended_action(self, item: ClassifiedIssue) -> str:
        """Return a Korean recommended action."""
        if item.severity == "critical":
            return "담당자에게 즉시 에스컬레이션하고, 필요하면 릴리즈를 보류하세요."
        if item.category == "regression":
            return "수정 검증을 우선 처리하고 회귀 테스트 커버리지를 추가하세요."
        if item.category == "test_gap":
            return "관련 작업을 닫기 전에 테스트 케이스를 작성하세요."
        if item.category == "flaky_test":
            return "필요 시 임시 격리하고, 근본 원인을 안정화하세요."
        if item.category == "documentation":
            return "QA 체크리스트를 업데이트하고 변경된 절차를 확인하세요."
        return "데일리 QA 트리아지에서 검토하세요."

    def ko_finding_title(self, title: str) -> str:
        """Translate reviewer finding titles to Korean."""
        return {
            "Critical attention needed": "긴급 확인 필요",
            "Regression watch": "회귀 위험 모니터링",
            "Coverage follow-up": "커버리지 보강 필요",
            "No urgent QA risk": "긴급 QA 위험 없음",
        }.get(title, title)

    def ko_finding_detail(self, detail: str) -> str:
        """Translate known reviewer finding details to Korean."""
        if "critical issue" in detail:
            return "릴리즈 판단 전에 Critical 이슈를 우선 검토해야 합니다."
        if "regression issue" in detail:
            return "회귀 이슈는 이전 안정 동작과 비교 검증이 필요합니다."
        if "missing QA automation" in detail:
            return "테스트 자동화 또는 수동 검증 커버리지 공백을 보강해야 합니다."
        return detail

    def html_escape(self, value: object) -> str:
        """Escape text for HTML output."""
        return escape(str(value), quote=True)
