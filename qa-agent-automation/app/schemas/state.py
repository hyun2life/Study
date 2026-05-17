"""Workflow state schemas."""

from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from pydantic import BaseModel, Field

from app.schemas.issue import ClassifiedIssue, Issue
from app.schemas.report import QaReport


class AutomationState(BaseModel):
    """Mutable state passed between workflow agents."""

    run_id: str = Field(default_factory=lambda: str(uuid4()))
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    finished_at: datetime | None = None
    issues: list[Issue] = Field(default_factory=list)
    classified_issues: list[ClassifiedIssue] = Field(default_factory=list)
    report: QaReport | None = None
    report_path: str | None = None
    html_report_path: str | None = None
    korean_html_report_path: str | None = None
    manifest_path: str | None = None
    index_path: str | None = None
    email_payload_path: str | None = None
    email_sent: bool = False
    messages: list[str] = Field(default_factory=list)

    def mark_finished(self) -> None:
        """Mark this workflow run as finished."""
        self.finished_at = datetime.now(timezone.utc)
