"""Command-line entry point for the QA Daily Report Bot."""

from __future__ import annotations

import sys
from pathlib import Path

if __package__ in {None, ""}:
    sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.config import Settings
from app.orchestrator import QaReportOrchestrator


def main() -> None:
    """Run the mock QA report workflow and print Markdown to stdout."""
    settings = Settings.from_env()
    orchestrator = QaReportOrchestrator.from_settings(settings)
    print(orchestrator.run_report_markdown())


if __name__ == "__main__":
    main()

