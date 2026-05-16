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
    assert "Daily QA Report" in tmp_path.joinpath(Path(state.report_path).name).read_text(
        encoding="utf-8"
    )
    assert "<!doctype html>" in tmp_path.joinpath(
        Path(state.html_report_path).name
    ).read_text(encoding="utf-8")


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
