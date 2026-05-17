"""Mock email client for future HTML report delivery."""

from __future__ import annotations

from app.schemas.email import EmailPayload, EmailSendResult
from app.schemas.report import QaReport


class EmailClient:
    """Build and optionally send email payloads.

    The current implementation is a dry-run mock. It does not call SMTP or any
    external email API.
    """

    def __init__(self, enabled: bool = False, recipients: list[str] | None = None) -> None:
        self.enabled = enabled
        self.recipients = recipients or []

    def build_report_email(
        self,
        report: QaReport,
        html_body: str,
        text_body: str,
        attachments: list[str],
        language: str = "ko",
    ) -> EmailPayload:
        """Create an email payload for the generated QA report."""
        subject_prefix = "[QA Daily]" if language == "en" else "[QA 데일리]"
        return EmailPayload(
            subject=f"{subject_prefix} {report.repository} - {report.generated_at.date()}",
            recipients=self.recipients,
            html_body=html_body,
            text_body=text_body,
            attachments=attachments,
            dry_run=not self.enabled,
        )

    def send(self, payload: EmailPayload) -> EmailSendResult:
        """Pretend to send an email payload."""
        if not self.enabled:
            return EmailSendResult(
                sent=False,
                message="Email delivery is disabled. Payload generated only.",
            )
        return EmailSendResult(
            sent=False,
            message="Real email delivery is not implemented yet.",
        )
