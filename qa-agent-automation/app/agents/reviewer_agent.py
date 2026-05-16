"""QA review agent."""

from __future__ import annotations

from collections import Counter

from app.schemas.issue import ClassifiedIssue
from app.schemas.report import ReviewFinding


class ReviewerAgent:
    """Generate QA reviewer findings from classified issues."""

    def review(self, issues: list[ClassifiedIssue]) -> list[ReviewFinding]:
        """Return high-level findings for the daily report."""
        findings: list[ReviewFinding] = []
        severity_counts = Counter(item.severity for item in issues)
        category_counts = Counter(item.category for item in issues)

        critical_count = severity_counts.get("critical", 0)
        if critical_count:
            findings.append(
                ReviewFinding(
                    title="Critical attention needed",
                    detail=f"{critical_count} critical issue(s) should be reviewed before release decisions.",
                )
            )

        regression_count = category_counts.get("regression", 0)
        if regression_count:
            findings.append(
                ReviewFinding(
                    title="Regression watch",
                    detail=f"{regression_count} regression issue(s) need comparison against previous stable behavior.",
                )
            )

        test_gap_count = category_counts.get("test_gap", 0)
        if test_gap_count:
            findings.append(
                ReviewFinding(
                    title="Coverage follow-up",
                    detail=f"{test_gap_count} issue(s) indicate missing QA automation or manual test coverage.",
                )
            )

        if not findings:
            findings.append(
                ReviewFinding(
                    title="No urgent QA risk",
                    detail="No critical, regression, or coverage-gap pattern was found in this run.",
                )
            )

        return findings

