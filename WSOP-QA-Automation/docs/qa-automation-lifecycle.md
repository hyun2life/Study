# WSOP QA Automation Lifecycle

## 1. Purpose

이 문서는 WSOP 앱 QA를 `TC 작성 -> 실행 기록 -> 결함 등록 -> QA 결과 리포트`까지 이어지는 하나의 흐름으로 운영하기 위한 기준이다.

현재 단계에서는 실제 앱 저장소와 테스트 환경 접근 전이므로, Google Sheet를 중심으로 QA 운영 자동화의 골격을 먼저 만든다.

## 2. Operating Flow

1. `TC_Master`에 테스트 케이스를 등록한다.
2. `Test_Run`에 실행 단위를 만든다.
3. `Execution_Log`에 Run ID별 TC 실행 결과를 기록한다.
4. 실패 또는 차단 건은 `Defect_Log`에 결함으로 등록한다.
5. `QA_Report`가 Run ID 기준으로 결과를 자동 집계한다.

## 3. Sheet Roles

### TC_Master

테스트 케이스의 기준 테이블이다.

주요 컬럼:

- `TC ID`
- `대분류`
- `중분류`
- `소분류`
- `TC 제목`
- `테스트 유형`
- `우선순위`
- `자동화 대상`
- `추천 자동화 방식`
- `사전조건`
- `테스트 절차`
- `기대결과`
- `검증 포인트`
- `산출물`
- `실행 상태`

### Test_Run

테스트 실행 회차를 관리한다.

예:

- `RUN-2026-001`
- `Initial Smoke Template`
- `Build/Version`
- `Environment`
- `Device`
- `Total TC`
- `Pass`
- `Fail`
- `Blocked`
- `Not Run`
- `Pass Rate`

### Execution_Log

TC별 실제 실행 결과를 기록한다.

결과 값은 아래 네 가지를 기본으로 둔다.

- `Pass`
- `Fail`
- `Blocked`
- `Not Run`

실패 시 `Evidence Link`, `Defect ID`, `Actual Result`를 반드시 채운다.

### Defect_Log

실패 또는 차단된 항목의 결함 정보를 관리한다.

주요 컬럼:

- `Run ID`
- `Defect ID`
- `TC ID`
- `Severity`
- `Priority`
- `Title`
- `Status`
- `Owner`
- `Evidence Link`
- `Expected`
- `Actual`

### QA_Report

Run ID 기준으로 자동 집계되는 보고서 탭이다.

현재 자동 집계 항목:

- 전체 TC 수
- Pass 수
- Fail 수
- Blocked 수
- Not Run 수
- Pass Rate
- Total Defects
- Open Defects
- QA Result
- Summary Comment

## 4. Initial QA Result Rule

초기 판정 기준은 단순하게 둔다.

| Condition | Result |
|---|---|
| Fail > 0 | No-Go Review |
| Fail = 0 and Blocked > 0 | Conditional Go |
| Fail = 0 and Blocked = 0 and Not Run > 0 | In Progress |
| Fail = 0 and Blocked = 0 and Not Run = 0 | Go Candidate |

이 기준은 실제 회사의 release policy에 맞춰 조정한다.

## 5. Automation Expansion Plan

### Current

Google Sheet 기반 운영 자동화:

- TC 관리
- Run 관리
- 실행 결과 집계
- 결함 수 집계
- QA 결과 초안 생성

### Next

실제 저장소 접근 후 자동화:

- Playwright 실행 결과를 `Execution_Log`로 자동 반영
- Playwright trace/screenshot 링크를 `Evidence Link`에 자동 반영
- 실패 TC를 `Defect_Log` 후보로 자동 생성
- CI 실행 결과를 `Test_Run`에 자동 등록
- Slack/Email 보고서 자동 발송 여부 검토

## 6. Guardrails

카지노 앱 특성상 다음 항목은 자동화 시스템에서 강하게 분리한다.

- 실결제 금지
- 실제 베팅 금지
- 실제 유저 자산 변경 금지
- 실사용자 계정 금지
- 결제/보상 관련 자동화는 sandbox 또는 read-only 검증만 허용

## 7. Google Sheet

https://docs.google.com/spreadsheets/d/1YVeyjdoLetBq8yU67C5YTs6fpLyFKn1MUZhlxqB2WL8/edit?usp=drivesdk
