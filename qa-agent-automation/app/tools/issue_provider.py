"""Issue provider interfaces for mock and future real GitHub integrations."""

from __future__ import annotations

from typing import Protocol

from app.mock_data.issues import build_mock_issues
from app.schemas.issue import Issue


class IssueProvider(Protocol):
    """Fetch normalized issues for a repository."""

    def fetch_issues(self, owner: str, repo: str) -> list[Issue]:
        """Return issues normalized to the shared Issue schema."""
        ...


class MockGitHubIssueProvider:
    """Issue provider backed by local mock scenarios."""

    def __init__(self, scenario: str = "normal") -> None:
        self.scenario = scenario

    def fetch_issues(self, owner: str, repo: str) -> list[Issue]:
        """Return mock issues for the configured scenario."""
        return build_mock_issues(owner=owner, repo=repo, scenario=self.scenario)


class RealGitHubIssueProvider:
    """Placeholder provider for a future real GitHub API adapter."""

    def __init__(self, token: str | None = None, api_base_url: str | None = None) -> None:
        self.token = token
        self.api_base_url = api_base_url or "https://api.github.com"

    def fetch_issues(self, owner: str, repo: str) -> list[Issue]:
        """Fetch issues from GitHub after the real adapter is implemented."""
        raise NotImplementedError(
            "Real GitHub API integration is not implemented yet. "
            "Map API responses to app.schemas.issue.Issue before returning."
        )
