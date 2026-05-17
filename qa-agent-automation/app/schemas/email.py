"""Email-related Pydantic schemas."""

from __future__ import annotations

from pydantic import BaseModel, Field


class EmailPayload(BaseModel):
    """A mock email payload ready for a future email provider."""

    subject: str
    recipients: list[str] = Field(default_factory=list)
    html_body: str
    text_body: str
    attachments: list[str] = Field(default_factory=list)
    dry_run: bool = True


class EmailSendResult(BaseModel):
    """Result returned by the email client."""

    sent: bool
    provider: str = "mock"
    message: str
