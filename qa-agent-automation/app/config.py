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
    report_timezone: str = Field(default="Asia/Seoul")
    report_output_dir: str = Field(default="reports")
    save_report_to_file: bool = Field(default=True)
    save_html_report_to_file: bool = Field(default=True)
    save_korean_html_report_to_file: bool = Field(default=True)
    messenger_enabled: bool = Field(default=False)

    @classmethod
    def from_env(cls) -> "Settings":
        """Create settings from environment variables with mock-friendly defaults."""
        return cls(
            app_name=os.getenv("APP_NAME", "QA Daily Report Bot"),
            github_owner=os.getenv("GITHUB_OWNER", "example-org"),
            github_repo=os.getenv("GITHUB_REPO", "example-repo"),
            report_title=os.getenv("REPORT_TITLE", "QA Daily Report"),
            report_timezone=os.getenv("REPORT_TIMEZONE", "Asia/Seoul"),
            report_output_dir=os.getenv("REPORT_OUTPUT_DIR", "reports"),
            save_report_to_file=os.getenv("SAVE_REPORT_TO_FILE", "true").lower() == "true",
            save_html_report_to_file=os.getenv("SAVE_HTML_REPORT_TO_FILE", "true").lower()
            == "true",
            save_korean_html_report_to_file=os.getenv(
                "SAVE_KOREAN_HTML_REPORT_TO_FILE", "true"
            ).lower()
            == "true",
            messenger_enabled=os.getenv("MESSENGER_ENABLED", "false").lower() == "true",
        )
