"""Snapshot-style checks for rendered report output."""

from __future__ import annotations

from app.config import Settings
from app.orchestrator import QaReportOrchestrator


def test_html_render_contains_visual_contract(tmp_path) -> None:
    """HTML output should keep its key visual/report sections."""
    settings = Settings(report_output_dir=str(tmp_path))
    state = QaReportOrchestrator.from_settings(settings).run()

    assert state.report is not None
    html = state.report.to_html()

    assert "background:#172033" in html
    assert "Priority Issues" in html
    assert "Release Blocker Candidates" in html
    assert "QA Action Items" in html
    assert "Issue Matrix" in html
    assert "display:inline-block;padding:4px 8px" in html


def test_korean_html_render_contains_visual_contract(tmp_path) -> None:
    """Korean HTML output should keep translated sections and links."""
    settings = Settings(report_output_dir=str(tmp_path))
    state = QaReportOrchestrator.from_settings(settings).run()

    assert state.report is not None
    html = state.report.to_korean_html()

    assert '<html lang="ko">' in html
    assert "QA 데일리 리포트" in html
    assert "우선 확인 이슈" in html
    assert "릴리즈 블로커 후보" in html
    assert "QA 액션 아이템" in html
    assert "이슈 매트릭스" in html
    assert "만료된 쿠폰 적용 시 결제 화면 크래시" in html
