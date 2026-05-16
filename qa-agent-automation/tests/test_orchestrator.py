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

    assert len(state.issues) == 5
    assert len(state.classified_issues) == 5
    assert state.report is not None
    assert state.report.summary.total_issues == 5
    assert state.report.summary.by_severity["critical"] == 1
    assert state.report.summary.by_category["regression"] == 1
    assert state.report_path is not None
    assert "Daily QA Report" in tmp_path.joinpath(Path(state.report_path).name).read_text(
        encoding="utf-8"
    )


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
    assert "Repository: `acme/qa-demo`" in markdown
    assert "## Priority Issues" in markdown
    assert "**Critical** #31 Checkout crashes" in markdown
    assert "## Issue Details" in markdown
    assert "#31 Checkout crashes" in markdown
