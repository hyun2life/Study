"""Report-related Pydantic schemas."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.issue import ClassifiedIssue, QaCategory, Severity


class ReportSummary(BaseModel):
    """Aggregated counts used in the daily report."""

    total_issues: int = 0
    by_category: dict[QaCategory, int] = Field(default_factory=dict)
    by_severity: dict[Severity, int] = Field(default_factory=dict)


class ReviewFinding(BaseModel):
    """A QA review note derived from classified issues."""

    title: str
    detail: str


class QaReport(BaseModel):
    """A QA report that can be rendered by multiple output renderers."""

    title: str
    repository: str
    generated_at: datetime
    summary: ReportSummary
    issues: list[ClassifiedIssue] = Field(default_factory=list)
    findings: list[ReviewFinding] = Field(default_factory=list)

    def to_markdown(self) -> str:
        """Render this report as Markdown."""
        from app.renderers.markdown_renderer import MarkdownReportRenderer

        return MarkdownReportRenderer().render(self)

    def to_html(self) -> str:
        """Render this report as English email-friendly HTML."""
        from app.renderers.html_renderer import HtmlReportRenderer

        return HtmlReportRenderer(language="en").render(self)

    def to_korean_html(self) -> str:
        """Render this report as Korean email-friendly HTML."""
        from app.renderers.html_renderer import HtmlReportRenderer

        return HtmlReportRenderer(language="ko").render(self)
