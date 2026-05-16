"""Mock GitHub client.

This adapter intentionally avoids real GitHub API calls. Replace the mock
implementation later with a real client that returns the same Issue schema.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.schemas.issue import Issue


class GitHubClient:
    """Fetch issues from GitHub or from mock data."""

    def __init__(self, owner: str, repo: str, use_mock: bool = True) -> None:
        self.owner = owner
        self.repo = repo
        self.use_mock = use_mock

    def fetch_issues(self) -> list[Issue]:
        """Return issue data for the configured repository."""
        if not self.use_mock:
            raise NotImplementedError("Real GitHub API integration is not implemented yet.")

        now = datetime.now(timezone.utc)
        return [
            Issue(
                id=1001,
                number=31,
                title="Checkout crashes when applying expired coupon",
                body="The checkout page throws a 500 error when an expired coupon is applied.",
                labels=["bug", "checkout", "p0"],
                author="qa-min",
                url=f"https://github.com/{self.owner}/{self.repo}/issues/31",
                created_at=now - timedelta(hours=8),
                updated_at=now - timedelta(hours=1),
            ),
            Issue(
                id=1002,
                number=32,
                title="Regression: login redirect loses return URL",
                body="After login, users are sent to the dashboard instead of the original page.",
                labels=["regression", "auth", "p1"],
                author="dev-lee",
                url=f"https://github.com/{self.owner}/{self.repo}/issues/32",
                created_at=now - timedelta(days=1),
                updated_at=now - timedelta(hours=2),
            ),
            Issue(
                id=1003,
                number=33,
                title="Add tests for password reset token expiration",
                body="The token expiration path does not have automated QA coverage.",
                labels=["test-gap", "auth"],
                author="qa-park",
                url=f"https://github.com/{self.owner}/{self.repo}/issues/33",
                created_at=now - timedelta(days=2),
                updated_at=now - timedelta(hours=5),
            ),
            Issue(
                id=1004,
                number=34,
                title="Search result ordering test is flaky in CI",
                body="The ordering assertion intermittently fails on the nightly test run.",
                labels=["flaky-test", "ci"],
                author="qa-kim",
                url=f"https://github.com/{self.owner}/{self.repo}/issues/34",
                created_at=now - timedelta(days=3),
                updated_at=now - timedelta(hours=7),
            ),
            Issue(
                id=1005,
                number=35,
                title="Update release checklist documentation",
                body="The QA release checklist is missing the new smoke test steps.",
                labels=["docs", "process"],
                author="pm-choi",
                url=f"https://github.com/{self.owner}/{self.repo}/issues/35",
                created_at=now - timedelta(days=4),
                updated_at=now - timedelta(hours=10),
            ),
        ]

