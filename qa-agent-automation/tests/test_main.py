"""Tests for the command-line entry point."""

from __future__ import annotations

from app.main import artifact_paths, settings_from_args
from app.schemas.state import AutomationState


class Args:
    """Simple argparse namespace stand-in for settings tests."""

    owner = "acme"
    repo = "qa-demo"
    title = "QA Demo"
    output_dir = "tmp-reports"
    timezone = "Asia/Seoul"
    preview = "paths"
    show_paths = True
    open_html = "ko"
    no_markdown = False
    no_html = False
    no_ko_html = False
    ko_only = True
    no_manifest = False


def test_settings_from_args_supports_ko_only() -> None:
    """CLI settings should support Korean-only HTML output."""
    settings = settings_from_args(Args())

    assert settings.github_owner == "acme"
    assert settings.github_repo == "qa-demo"
    assert settings.report_title == "QA Demo"
    assert settings.report_output_dir == "tmp-reports"
    assert settings.save_report_to_file is False
    assert settings.save_html_report_to_file is False
    assert settings.save_korean_html_report_to_file is True


def test_artifact_paths_filters_missing_values() -> None:
    """Only generated artifact paths should be returned."""
    state = AutomationState(
        report_path=None,
        html_report_path="reports/demo.html",
        korean_html_report_path="reports/demo.ko.html",
        manifest_path="reports/demo.manifest.json",
    )

    assert artifact_paths(state) == {
        "html": "reports/demo.html",
        "html_ko": "reports/demo.ko.html",
        "manifest": "reports/demo.manifest.json",
    }
