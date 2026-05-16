"""Issue-related Pydantic schemas."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


IssueState = Literal["open", "closed"]
QaCategory = Literal[
    "bug",
    "regression",
    "test_gap",
    "flaky_test",
    "documentation",
    "enhancement",
    "unknown",
]
Severity = Literal["critical", "high", "medium", "low"]


class Issue(BaseModel):
    """A GitHub issue normalized for QA processing."""

    id: int
    number: int
    title: str
    body: str = ""
    labels: list[str] = Field(default_factory=list)
    author: str
    assignees: list[str] = Field(default_factory=list)
    milestone: str | None = None
    url: HttpUrl
    state: IssueState = "open"
    created_at: datetime
    updated_at: datetime


class ClassifiedIssue(BaseModel):
    """An issue enriched with QA classification metadata."""

    issue: Issue
    category: QaCategory
    severity: Severity
    qa_notes: str
    recommended_action: str
