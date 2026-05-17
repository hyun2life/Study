"""Tests for report profiles and mock scenarios."""

from __future__ import annotations

from app.config_profiles import load_profile
from app.mock_data.issues import build_mock_issues


def test_load_profile_reads_simple_yaml() -> None:
    """Profiles should load from the bundled YAML file."""
    profile = load_profile("release-risk", "config/report_profiles.yaml")

    assert profile["repo"] == "checkout-service"
    assert profile["scenario"] == "release-risk"


def test_mock_scenarios_have_distinct_shapes() -> None:
    """Mock scenarios should produce useful demo variations."""
    normal = build_mock_issues("acme", "qa-demo", "normal")
    release_risk = build_mock_issues("acme", "qa-demo", "release-risk")
    quiet = build_mock_issues("acme", "qa-demo", "quiet")

    assert len(normal) == 8
    assert len(release_risk) > len(normal)
    assert len(quiet) == 2
    assert any("release-blocker" in issue.labels for issue in release_risk)
    assert all("p0" not in issue.labels for issue in quiet)
