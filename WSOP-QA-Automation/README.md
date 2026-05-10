# WSOP QA Automation

Google Play Store에 배포된 WSOP 앱을 기준으로, 입사 전 준비 가능한 QA 자동화 전략과 Playwright 중심의 1차 자동화 후보를 정리하는 공간이다.

## Start Here

- Google Sheet: https://docs.google.com/spreadsheets/d/1YVeyjdoLetBq8yU67C5YTs6fpLyFKn1MUZhlxqB2WL8/edit?usp=drivesdk
- Local automation runner: [run_local_pipeline.ps1](automation/run_local_pipeline.ps1)
- Playwright result importer: [import_playwright_results.py](automation/import_playwright_results.py)
- QA report generator: [generate_qa_report.py](automation/generate_qa_report.py)
- Google Sheets webhook: [Code.gs](automation/google-sheets-webhook/Code.gs)
- [Automation Strategy and Filter](docs/automation-strategy-and-filter.md)
- [QA Automation Lifecycle](docs/qa-automation-lifecycle.md)
- [Playwright to QA Report Integration](docs/playwright-to-report-integration.md)
- [Playwright QA Automation Plan](wsop-playwright-qa-automation-plan.md)
- [Google Sheet TC Matrix](google-sheet-link.md)

## Current Focus

1차 목표는 앱 전체 자동화가 아니라, Playwright 실행 결과를 기준으로 `TC 작성 -> 실행 기록 -> 결함 등록 -> QA 결과 리포트`까지 이어지는 운영 흐름을 자동화하고, 이후 실제 WSOP 앱 저장소에 연결하는 것이다.

## Local Automation

샘플 Playwright 결과를 QA 리포트로 변환한다.

```powershell
powershell -ExecutionPolicy Bypass -File automation\run_local_pipeline.ps1 -RunId RUN-LOCAL-VERIFY
```

생성 산출물:

- `automation/output/sheet_payload.json`
- `automation/output/qa_report_summary.json`
- `automation/output/qa_report.html`

우선순위는 다음과 같다.

1. WebView, 모바일 웹, API처럼 Playwright 적합성이 높은 영역
2. 로그인, 홈, 프로모션, 지갑, 책임 게임처럼 비즈니스 영향도가 큰 smoke path
3. 실결제, 실베팅, 실제 유저 자산 변경이 발생하지 않는 안전한 테스트
4. 실패 시 trace, screenshot, network log, device log로 원인을 파악할 수 있는 테스트

## First Decision

자동화 후보는 `Business Criticality`, `Repeatability`, `Determinism`, `Tool Fit`, `Data Safety`, `Maintenance Cost`, `Execution Cost`, `Observability` 기준으로 점수화한다.

`Data Safety`가 0점이면 총점과 관계없이 1차 자동화 대상에서 제외한다.
