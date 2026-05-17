"""Mock GitHub client.

This adapter intentionally avoids real GitHub API calls. Replace the mock
implementation later with a real client that returns the same Issue schema.
"""

from __future__ import annotations

from app.mock_data.issues import build_mock_issues
from app.schemas.issue import Issue


class GitHubClient:
    """Fetch issues from GitHub or from mock data."""

    def __init__(
        self,
        owner: str,
        repo: str,
        use_mock: bool = True,
        scenario: str = "normal",
    ) -> None:
        self.owner = owner
        self.repo = repo
        self.use_mock = use_mock
        self.scenario = scenario

    def fetch_issues(self) -> list[Issue]:
        """Return issue data for the configured repository."""
        if not self.use_mock:
            raise NotImplementedError("Real GitHub API integration is not implemented yet.")

        return build_mock_issues(
            owner=self.owner,
            repo=self.repo,
            scenario=self.scenario,
        )
