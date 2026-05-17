"""Tests for company adoption-oriented extension points."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from app.config import Settings
from app.orchestrator import QaReportOrchestrator
from app.tools.github_client import GitHubClient
from app.tools.issue_provider import RealGitHubIssueProvider


def test_orchestrator_exports_structured_json_report(tmp_path) -> None:
    """A structured JSON artifact should be available for later integrations."""
    settings = Settings(
        github_owner="acme",
        github_repo="qa-demo",
        report_output_dir=str(tmp_path),
    )
    orchestrator = QaReportOrchestrator.from_settings(settings)

    state = orchestrator.run()

    assert state.json_report_path is not None
    json_path = tmp_path / Path(state.json_report_path).name
    manifest = tmp_path / Path(state.manifest_path or "").name
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    manifest_payload = json.loads(manifest.read_text(encoding="utf-8"))
    assert payload["repository"] == "acme/qa-demo"
    assert len(payload["issues"]) == 8
    assert "json" in manifest_payload["artifacts"]
    assert "JSON" in tmp_path.joinpath("index.html").read_text(encoding="utf-8")


def test_github_client_uses_mock_provider_by_default() -> None:
    """The default client should remain mock-backed for local adoption."""
    client = GitHubClient(owner="acme", repo="qa-demo", scenario="quiet")

    issues = client.fetch_issues()

    assert len(issues) == 2
    assert issues[0].url.host == "github.com"


def test_real_github_provider_is_explicit_placeholder() -> None:
    """The real provider should fail clearly until company API details are added."""
    provider = RealGitHubIssueProvider(token="example")

    with pytest.raises(NotImplementedError, match="Real GitHub API integration"):
        provider.fetch_issues(owner="acme", repo="qa-demo")
