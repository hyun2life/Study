"""Simple in-memory workflow run store."""

from __future__ import annotations

from app.schemas.state import AutomationState


class RunStore:
    """Store workflow state in memory for tests and local runs."""

    def __init__(self) -> None:
        self._runs: dict[str, AutomationState] = {}

    def save(self, state: AutomationState) -> None:
        """Save or replace a workflow state."""
        self._runs[state.run_id] = state

    def get(self, run_id: str) -> AutomationState | None:
        """Return a stored workflow state by run ID."""
        return self._runs.get(run_id)

    def list_runs(self) -> list[AutomationState]:
        """Return all stored workflow states."""
        return list(self._runs.values())

