"""Mock GitHub issues for local report generation."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from app.schemas.issue import Issue


def build_mock_issues(owner: str, repo: str, scenario: str = "normal") -> list[Issue]:
    """Return realistic mock issues for the configured repository."""
    if scenario == "quiet":
        return build_quiet_day_issues(owner=owner, repo=repo)
    if scenario == "release-risk":
        return build_release_risk_issues(owner=owner, repo=repo)
    return build_normal_day_issues(owner=owner, repo=repo)


def build_normal_day_issues(owner: str, repo: str) -> list[Issue]:
    """Return a normal QA day with a mix of issue types."""
    now = datetime.now(timezone.utc)
    return [
        Issue(
            id=1001,
            number=31,
            title="Checkout crashes when applying expired coupon",
            body="The checkout page throws a 500 error when an expired coupon is applied.",
            labels=["bug", "checkout", "p0", "release-blocker"],
            author="qa-min",
            assignees=["dev-lee"],
            milestone="May Release",
            url=f"https://github.com/{owner}/{repo}/issues/31",
            created_at=now - timedelta(hours=4),
            updated_at=now - timedelta(hours=1),
        ),
        Issue(
            id=1002,
            number=32,
            title="Regression: login redirect loses return URL",
            body="After login, users are sent to the dashboard instead of the original page.",
            labels=["regression", "auth", "p1"],
            author="dev-lee",
            assignees=["dev-kang"],
            milestone="May Release",
            url=f"https://github.com/{owner}/{repo}/issues/32",
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
            assignees=["qa-park"],
            milestone="Test Hardening",
            url=f"https://github.com/{owner}/{repo}/issues/33",
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
            assignees=["qa-kim", "dev-yoon"],
            milestone="Test Hardening",
            url=f"https://github.com/{owner}/{repo}/issues/34",
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
            assignees=["qa-min"],
            milestone="Process",
            url=f"https://github.com/{owner}/{repo}/issues/35",
            created_at=now - timedelta(days=4),
            updated_at=now - timedelta(hours=10),
        ),
        Issue(
            id=1006,
            number=36,
            title="Mobile payment modal is clipped on small screens",
            body="On 360px wide devices, the payment confirmation button is partially hidden.",
            labels=["bug", "mobile", "p2"],
            author="qa-seo",
            assignees=["dev-han"],
            milestone="May Release",
            url=f"https://github.com/{owner}/{repo}/issues/36",
            created_at=now - timedelta(hours=6),
            updated_at=now - timedelta(minutes=45),
        ),
        Issue(
            id=1007,
            number=37,
            title="Add exploratory checklist for subscription upgrade flow",
            body="The new subscription upgrade flow needs a focused exploratory test checklist.",
            labels=["test-gap", "billing"],
            author="qa-min",
            assignees=["qa-seo"],
            milestone="Test Hardening",
            url=f"https://github.com/{owner}/{repo}/issues/37",
            created_at=now - timedelta(hours=2),
            updated_at=now - timedelta(minutes=30),
        ),
        Issue(
            id=1008,
            number=38,
            title="Improve empty-state copy for failed search",
            body="Users see a generic empty state when search fails due to a network timeout.",
            labels=["enhancement", "ux"],
            author="designer-jung",
            assignees=["pm-choi"],
            milestone="Backlog",
            url=f"https://github.com/{owner}/{repo}/issues/38",
            created_at=now - timedelta(days=5),
            updated_at=now - timedelta(days=1, hours=3),
        ),
    ]


def build_release_risk_issues(owner: str, repo: str) -> list[Issue]:
    """Return a risk-heavy QA day for release readiness demos."""
    issues = build_normal_day_issues(owner=owner, repo=repo)
    now = datetime.now(timezone.utc)
    issues.extend(
        [
            Issue(
                id=2001,
                number=41,
                title="Production smoke test fails after payment callback",
                body="Smoke test returns a 500 error after the payment provider callback.",
                labels=["bug", "p0", "release-blocker", "payments"],
                author="qa-lead",
                assignees=["dev-payment"],
                milestone="May Release",
                url=f"https://github.com/{owner}/{repo}/issues/41",
                created_at=now - timedelta(hours=1),
                updated_at=now - timedelta(minutes=10),
            ),
            Issue(
                id=2002,
                number=42,
                title="Regression: order confirmation email is not sent",
                body="The confirmation email path stopped working after the latest merge.",
                labels=["regression", "email", "p1"],
                author="qa-min",
                assignees=["dev-mail"],
                milestone="May Release",
                url=f"https://github.com/{owner}/{repo}/issues/42",
                created_at=now - timedelta(hours=3),
                updated_at=now - timedelta(minutes=20),
            ),
        ]
    )
    return issues


def build_quiet_day_issues(owner: str, repo: str) -> list[Issue]:
    """Return a low-risk QA day for empty and calm-state demos."""
    now = datetime.now(timezone.utc)
    return [
        Issue(
            id=3001,
            number=51,
            title="Update QA onboarding checklist copy",
            body="Refresh wording for the onboarding checklist before the next QA sync.",
            labels=["docs", "process"],
            author="qa-min",
            assignees=["qa-min"],
            milestone="Process",
            url=f"https://github.com/{owner}/{repo}/issues/51",
            created_at=now - timedelta(days=2),
            updated_at=now - timedelta(hours=3),
        ),
        Issue(
            id=3002,
            number=52,
            title="Improve empty-state screenshot in test guide",
            body="The screenshot in the test guide is outdated.",
            labels=["enhancement", "docs"],
            author="qa-seo",
            assignees=["qa-seo"],
            milestone="Backlog",
            url=f"https://github.com/{owner}/{repo}/issues/52",
            created_at=now - timedelta(days=4),
            updated_at=now - timedelta(days=1),
        ),
    ]
