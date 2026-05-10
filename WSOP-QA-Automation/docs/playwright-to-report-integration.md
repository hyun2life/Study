# Playwright to QA Report Integration

## 1. Target Flow

최종 목표는 Playwright 실행 결과가 Google Sheet의 `Execution_Log`에 자동 반영되고, `QA_Report`가 Run ID 기준으로 자동 집계되는 구조다.

```text
Playwright Test
  -> JSON/JUnit/HTML Report
  -> Result Parser
  -> Execution_Log
  -> Defect_Log Candidate
  -> QA_Report
```

## 2. Required Mapping

Playwright 테스트명 또는 annotation에 `TC ID`를 반드시 포함한다.

예:

```ts
test('TC-SMK-002 QA account can login', async ({ page }) => {
  // ...
});
```

권장 매핑:

| Playwright Output | Google Sheet Column |
|---|---|
| run id | `Execution_Log.Run ID` |
| execution date | `Execution_Log.Run Date` |
| project/device | `Execution_Log.Device` |
| test title TC ID | `Execution_Log.TC ID` |
| status passed | `Execution_Log.Result = Pass` |
| status failed | `Execution_Log.Result = Fail` |
| status skipped/timedOut/interrupted | `Execution_Log.Result = Blocked` |
| error message | `Execution_Log.Actual Result` |
| trace/screenshot/html report path | `Execution_Log.Evidence Link` |
| linked issue id | `Execution_Log.Defect ID` |

## 3. Result Rules

| Playwright Status | Sheet Result |
|---|---|
| `passed` | `Pass` |
| `failed` | `Fail` |
| `timedOut` | `Fail` |
| `skipped` | `Blocked` |
| `interrupted` | `Blocked` |
| not executed | `Not Run` |

## 4. Defect Candidate Rule

자동 결함 후보는 아래 조건에서 만든다.

- `Result = Fail`
- 같은 `TC ID`가 이전 Run에서도 실패했다.
- `Actual Result`에 에러 메시지가 있다.
- evidence link가 있다.

초기에는 자동 등록보다 `Defect_Log` 후보 행 생성까지가 적절하다. 실제 Jira/GitHub Issue 생성은 회사의 결함 관리 정책을 확인한 뒤 연결한다.

## 5. Minimum Script Responsibilities

입사 후 만들 스크립트는 아래 역할만 먼저 담당한다.

1. Playwright JSON report 읽기
2. 테스트명에서 `TC ID` 추출
3. status를 `Pass/Fail/Blocked`로 변환
4. `Execution_Log`에 Run ID 기준 결과 upsert
5. 실패 케이스의 trace/screenshot 경로를 evidence로 기록
6. `QA_Report`는 Sheet formula에 맡긴다.

## 6. Guardrails

- 실결제/실베팅 TC는 Playwright 실행 대상에서 제외한다.
- 테스트명에 TC ID가 없으면 report import 대상에서 제외한다.
- 실패 evidence가 없으면 결함 후보를 자동 생성하지 않는다.
- `Execution_Log.Result` 값은 `Pass`, `Fail`, `Blocked`, `Not Run`만 사용한다.

## 7. Next Implementation Shape

저장소 접근 후 추천 구조:

```text
scripts/
  qa-report/
    import-playwright-results.ts
    google-sheets-client.ts
    result-mapper.ts
tests/
  smoke/
  regression/
playwright.config.ts
```

초기 CLI 예시:

```bash
node scripts/qa-report/import-playwright-results.ts \
  --run-id RUN-2026-001 \
  --report output/playwright/results.json
```
