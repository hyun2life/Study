"""QA issue classification agent."""

from __future__ import annotations

from app.schemas.issue import ClassifiedIssue, Issue, QaCategory, Severity


class ClassifierAgent:
    """Classify issues using deterministic QA heuristics."""

    def classify(self, issues: list[Issue]) -> list[ClassifiedIssue]:
        """Classify every issue by category and severity."""
        return [self._classify_one(issue) for issue in issues]

    def _classify_one(self, issue: Issue) -> ClassifiedIssue:
        labels = {label.lower() for label in issue.labels}
        text = f"{issue.title} {issue.body}".lower()
        category = self._category(labels, text)
        severity = self._severity(labels, text, category)

        return ClassifiedIssue(
            issue=issue,
            category=category,
            severity=severity,
            qa_notes=self._qa_notes(category, severity),
            recommended_action=self._recommended_action(category, severity),
        )

    def _category(self, labels: set[str], text: str) -> QaCategory:
        """Infer a QA category from labels and issue text."""
        if "regression" in labels or "regression" in text:
            return "regression"
        if "flaky-test" in labels or "flaky" in text:
            return "flaky_test"
        if "test-gap" in labels or "coverage" in text or "add tests" in text:
            return "test_gap"
        if "docs" in labels or "documentation" in text:
            return "documentation"
        if "bug" in labels or "crash" in text or "error" in text:
            return "bug"
        if "enhancement" in labels:
            return "enhancement"
        return "unknown"

    def _severity(self, labels: set[str], text: str, category: QaCategory) -> Severity:
        """Infer severity using simple QA-focused rules."""
        if "p0" in labels or "critical" in labels or "crash" in text or "500" in text:
            return "critical"
        if "p1" in labels or category == "regression":
            return "high"
        if category in {"documentation", "enhancement"}:
            return "low"
        return "medium"

    def _qa_notes(self, category: QaCategory, severity: Severity) -> str:
        """Create a short QA note for the classified issue."""
        if severity == "critical":
            return "Potential release blocker. Validate reproduction steps and affected scope first."
        if category == "regression":
            return "Regression risk detected. Compare against the last known good build."
        if category == "test_gap":
            return "Coverage gap detected. Add automated checks around the missing path."
        if category == "flaky_test":
            return "Stability risk detected. Isolate timing, ordering, or environment dependencies."
        return "Track in the QA queue and verify during the next triage pass."

    def _recommended_action(self, category: QaCategory, severity: Severity) -> str:
        """Create a recommended next action for QA triage."""
        if severity == "critical":
            return "Escalate to owner, reproduce immediately, and block release if confirmed."
        if category == "regression":
            return "Prioritize fix verification and add regression coverage."
        if category == "test_gap":
            return "Create test cases before closing the related feature or bug."
        if category == "flaky_test":
            return "Quarantine only if needed, then stabilize the root cause."
        if category == "documentation":
            return "Update QA checklist and confirm the new process with stakeholders."
        return "Review during daily QA triage."

