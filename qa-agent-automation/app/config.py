"""Application configuration."""

from __future__ import annotations

import os
from pydantic import BaseModel, Field


class Settings(BaseModel):
    """Runtime settings loaded from environment variables."""

    app_name: str = Field(default="QA Daily Report Bot")
    github_owner: str = Field(default="example-org")
    github_repo: str = Field(default="example-repo")
    report_title: str = Field(default="QA Daily Report")
    messenger_enabled: bool = Field(default=False)

    @classmethod
    def from_env(cls) -> "Settings":
        """Create settings from environment variables with mock-friendly defaults."""
        return cls(
            app_name=os.getenv("APP_NAME", "QA Daily Report Bot"),
            github_owner=os.getenv("GITHUB_OWNER", "example-org"),
            github_repo=os.getenv("GITHUB_REPO", "example-repo"),
            report_title=os.getenv("REPORT_TITLE", "QA Daily Report"),
            messenger_enabled=os.getenv("MESSENGER_ENABLED", "false").lower() == "true",
        )

