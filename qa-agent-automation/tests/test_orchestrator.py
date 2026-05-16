"""Tests for the QA report orchestrator."""

from __future__ import annotations

from app.config import Settings
from app.orchestrator import QaReportOrchestrator


def test_orchestrator_generates_report_from_mock_issues() -> None:
    """The orchestrator should produce a report from mock issue data."""
    settings = Settings(
        github_owner="acme",
        github_repo="qa-demo",
        report_title="Daily QA Report",
    )
    orchestrator = QaReportOrchestrator.from_settings(settings)

    state = orchestrator.run()

    assert len(state.issues) == 5
    assert len(state.classified_issues) == 5
    assert state.report is not None
    assert state.report.summary.total_issues == 5
    assert state.report.summary.by_severity["critical"] == 1
    assert state.report.summary.by_category["regression"] == 1


def test_orchestrator_renders_markdown() -> None:
    """The report should render useful Markdown output."""
    settings = Settings(github_owner="acme", github_repo="qa-demo")
    orchestrator = QaReportOrchestrator.from_settings(settings)

    markdown = orchestrator.run_report_markdown()

    assert "# QA Daily Report" in markdown
    assert "Repository: `acme/qa-demo`" in markdown
    assert "## Issue Details" in markdown
    assert "#31 Checkout crashes" in markdown

