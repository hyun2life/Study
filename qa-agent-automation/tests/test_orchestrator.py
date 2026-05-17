"""Tests for the QA report orchestrator."""

from __future__ import annotations

from pathlib import Path

from app.config import Settings
from app.orchestrator import QaReportOrchestrator


def test_orchestrator_generates_report_from_mock_issues(tmp_path) -> None:
    """The orchestrator should produce a report from mock issue data."""
    settings = Settings(
        github_owner="acme",
        github_repo="qa-demo",
        report_title="Daily QA Report",
        report_output_dir=str(tmp_path),
    )
    orchestrator = QaReportOrchestrator.from_settings(settings)

    state = orchestrator.run()

    assert len(state.issues) == 8
    assert len(state.classified_issues) == 8
    assert state.report is not None
    assert state.report.summary.total_issues == 8
    assert state.report.summary.by_severity["critical"] == 1
    assert state.report.summary.by_category["regression"] == 1
    assert state.report_path is not None
    assert state.html_report_path is not None
    assert state.korean_html_report_path is not None
    assert state.manifest_path is not None
    assert state.index_path is not None
    assert state.email_payload_path is not None
    assert "Daily QA Report" in tmp_path.joinpath(Path(state.report_path).name).read_text(
        encoding="utf-8"
    )
    assert "<!doctype html>" in tmp_path.joinpath(
        Path(state.html_report_path).name
    ).read_text(encoding="utf-8")
    assert "QA 데일리 리포트" in tmp_path.joinpath(
        Path(state.korean_html_report_path).name
    ).read_text(encoding="utf-8")
    assert '"html_ko"' in tmp_path.joinpath(Path(state.manifest_path).name).read_text(
        encoding="utf-8"
    )
    assert '"email_payload"' in tmp_path.joinpath(
        Path(state.manifest_path).name
    ).read_text(encoding="utf-8")
    assert "QA Report Index" in tmp_path.joinpath("index.html").read_text(
        encoding="utf-8"
    )
    assert "Email delivery is disabled" in "\n".join(state.messages)


def test_orchestrator_renders_markdown(tmp_path) -> None:
    """The report should render useful Markdown output."""
    settings = Settings(
        github_owner="acme",
        github_repo="qa-demo",
        report_output_dir=str(tmp_path),
    )
    orchestrator = QaReportOrchestrator.from_settings(settings)

    markdown = orchestrator.run_report_markdown()

    assert "# QA Daily Report" in markdown
    assert "| Repository | `acme/qa-demo` |" in markdown
    assert "## Priority Issues" in markdown
    assert "| **Critical** | [#31 Checkout crashes" in markdown
    assert "## Release Blocker Candidates" in markdown
    assert "## QA Action Items" in markdown
    assert "## Issue Matrix" in markdown
    assert "## Detailed Notes" in markdown


def test_orchestrator_renders_html_report(tmp_path) -> None:
    """The report should render an email-friendly HTML version."""
    settings = Settings(
        github_owner="acme",
        github_repo="qa-demo",
        report_output_dir=str(tmp_path),
    )
    orchestrator = QaReportOrchestrator.from_settings(settings)

    state = orchestrator.run()

    assert state.report is not None
    html = state.report.to_html()
    assert "<!doctype html>" in html
    assert "QA Daily Report" in html
    assert "Priority Issues" in html
    assert "Release Blocker Candidates" in html
    assert "QA Action Items" in html
    assert "Issue Matrix" in html
    assert "background:#172033" in html


def test_orchestrator_renders_korean_html_report(tmp_path) -> None:
    """The report should render a Korean email-friendly HTML version."""
    settings = Settings(
        github_owner="acme",
        github_repo="qa-demo",
        report_output_dir=str(tmp_path),
    )
    orchestrator = QaReportOrchestrator.from_settings(settings)

    state = orchestrator.run()

    assert state.report is not None
    html = state.report.to_korean_html()
    assert '<html lang="ko">' in html
    assert "QA 데일리 리포트" in html
    assert "우선 확인 이슈" in html
    assert "릴리즈 블로커 후보" in html
    assert "QA 액션 아이템" in html
    assert "이슈 매트릭스" in html
    assert "만료된 쿠폰 적용 시 결제 화면 크래시" in html
