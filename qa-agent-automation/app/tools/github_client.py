"""GitHub issue client facade."""

from __future__ import annotations

from app.schemas.issue import Issue
from app.tools.issue_provider import (
    IssueProvider,
    MockGitHubIssueProvider,
    RealGitHubIssueProvider,
)


class GitHubClient:
    """Fetch normalized issues through a pluggable provider."""

    def __init__(
        self,
        owner: str,
        repo: str,
        use_mock: bool = True,
        scenario: str = "normal",
        provider: IssueProvider | None = None,
    ) -> None:
        self.owner = owner
        self.repo = repo
        self.use_mock = use_mock
        self.scenario = scenario
        self.provider = provider or self._default_provider()

    def fetch_issues(self) -> list[Issue]:
        """Return issue data for the configured repository."""
        return self.provider.fetch_issues(owner=self.owner, repo=self.repo)

    def _default_provider(self) -> IssueProvider:
        """Build the provider implied by the current client settings."""
        if self.use_mock:
            return MockGitHubIssueProvider(scenario=self.scenario)
        return RealGitHubIssueProvider()
