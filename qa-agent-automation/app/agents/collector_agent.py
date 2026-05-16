"""Issue collection agent."""

from __future__ import annotations

from app.schemas.issue import Issue
from app.tools.github_client import GitHubClient


class CollectorAgent:
    """Collect issues from the configured issue source."""

    def __init__(self, github_client: GitHubClient) -> None:
        self.github_client = github_client

    def collect(self) -> list[Issue]:
        """Fetch issues through the GitHub client adapter."""
        return self.github_client.fetch_issues()

