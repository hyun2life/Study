"""Workflow orchestrator for the QA Daily Report Bot."""

from __future__ import annotations

from app.agents.classifier_agent import ClassifierAgent
from app.agents.collector_agent import CollectorAgent
from app.agents.reporter_agent import ReporterAgent
from app.agents.reviewer_agent import ReviewerAgent
from app.config import Settings
from app.schemas.state import AutomationState
from app.storage.run_store import RunStore
from app.tools.github_client import GitHubClient
from app.tools.messenger import Messenger


class QaReportOrchestrator:
    """Coordinate agents to produce a QA daily report."""

    def __init__(
        self,
        settings: Settings,
        collector: CollectorAgent,
        classifier: ClassifierAgent,
        reviewer: ReviewerAgent,
        reporter: ReporterAgent,
        messenger: Messenger,
        run_store: RunStore,
    ) -> None:
        self.settings = settings
        self.collector = collector
        self.classifier = classifier
        self.reviewer = reviewer
        self.reporter = reporter
        self.messenger = messenger
        self.run_store = run_store

    @classmethod
    def from_settings(cls, settings: Settings) -> "QaReportOrchestrator":
        """Create an orchestrator with mock-friendly default dependencies."""
        github_client = GitHubClient(
            owner=settings.github_owner,
            repo=settings.github_repo,
            use_mock=True,
        )
        return cls(
            settings=settings,
            collector=CollectorAgent(github_client),
            classifier=ClassifierAgent(),
            reviewer=ReviewerAgent(),
            reporter=ReporterAgent(),
            messenger=Messenger(enabled=settings.messenger_enabled),
            run_store=RunStore(),
        )

    def run(self) -> AutomationState:
        """Run the full report workflow and return final state."""
        state = AutomationState()
        state.messages.append("Collecting mock GitHub issues.")
        state.issues = self.collector.collect()

        state.messages.append("Classifying issues from a QA perspective.")
        state.classified_issues = self.classifier.classify(state.issues)

        state.messages.append("Reviewing classified issues for daily QA findings.")
        findings = self.reviewer.review(state.classified_issues)

        repository = f"{self.settings.github_owner}/{self.settings.github_repo}"
        state.messages.append("Generating Markdown QA report.")
        state.report = self.reporter.build_report(
            title=self.settings.report_title,
            repository=repository,
            issues=state.classified_issues,
            findings=findings,
        )

        markdown = state.report.to_markdown()
        sent = self.messenger.send(markdown)
        state.messages.append(f"Messenger delivery enabled: {sent}.")

        state.mark_finished()
        self.run_store.save(state)
        return state

    def run_report_markdown(self) -> str:
        """Run the workflow and return the report rendered as Markdown."""
        state = self.run()
        if state.report is None:
            raise RuntimeError("Report generation failed.")
        return state.report.to_markdown()

