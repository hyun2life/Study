# WSOP QA Automation Strategy and Filter

## 1. Strategy Summary

WSOP 앱 자동화는 처음부터 앱 전체를 자동화 대상으로 보지 않는다.

1차 목표는 Playwright로 안정적으로 검증 가능한 영역을 먼저 분리하고, 반복 수동 QA 비용이 큰 경로부터 smoke suite로 만든다.

Playwright는 웹, WebView, API, 네트워크 검증, 스크린샷/trace 수집에 강하다. 반대로 순수 네이티브 UI, 게임 렌더링, OS 권한, 인앱결제는 Playwright만으로 안정성이 낮을 수 있으므로 별도 도구 또는 수동 checkpoint 후보로 둔다.

## 2. Automation Decision Filter

각 QA 시나리오는 아래 필터를 통과한 뒤 자동화 후보로 등록한다.

| Filter | Question | Pass Example | Fail or Hold Example |
|---|---|---|---|
| Business Criticality | 장애가 나면 유저/매출/정책에 큰 영향이 있는가? | 로그인, 결제 진입, 책임 게임, 지갑 | 낮은 노출의 이벤트 배너 |
| Repeatability | 매번 같은 조건으로 반복 실행 가능한가? | 테스트 계정 로그인, 프로모션 페이지 진입 | 랜덤 보상, 실시간 이벤트 결과 |
| Determinism | 기대 결과가 명확하고 자동 판정 가능한가? | 특정 CTA 표시, API 응답 상태 | 게임 결과, 애니메이션 타이밍 |
| Tool Fit | Playwright가 안정적으로 접근 가능한가? | WebView, 모바일 웹, API | 순수 네이티브 게임 화면 |
| Data Safety | 실결제/실베팅/실자산 변경 없이 검증 가능한가? | sandbox 결제 진입 전 확인 | 실제 칩 차감, 실제 구매 |
| Maintenance Cost | UI 변경에 너무 취약하지 않은가? | role/test id 기반 locator | 이미지 좌표 클릭만 가능한 화면 |
| Execution Cost | CI나 nightly에서 실행 가능한 시간인가? | 1분 이내 smoke | 긴 게임 플레이, 외부 승인 대기 |
| Observability | 실패 원인을 artifact로 남길 수 있는가? | trace, screenshot, logcat, network log | 외부 SDK 내부 오류만 노출 |

## 3. Scoring Rule

각 시나리오는 0-2점으로 평가한다.

| Score | Meaning |
|---|---|
| 2 | 자동화에 적합하다 |
| 1 | 조건부 자동화 가능하다 |
| 0 | 1차 자동화 대상에서 제외한다 |

추천 판정 기준:

| Total Score | Decision |
|---|---|
| 13-16 | 1차 자동화 우선 대상 |
| 9-12 | 조건부 자동화 대상 |
| 5-8 | 수동 QA + 추후 재검토 |
| 0-4 | 자동화 제외 |

단, `Data Safety`가 0점이면 총점과 관계없이 1차 자동화에서 제외한다.

## 4. Tool Fit Classification

### A. Playwright First

아래 조건이면 Playwright 1차 대상이다.

- 화면이 웹 또는 WebView 기반이다.
- DOM locator 또는 accessibility role로 요소를 찾을 수 있다.
- 기대값이 텍스트, URL, API 응답, 네트워크 요청, 화면 상태로 판정 가능하다.
- 실패 시 trace/screenshot/network log가 의미 있게 남는다.
- 테스트 데이터가 fixture 또는 API로 준비 가능하다.

대표 후보:

- 로그인 웹 플로우
- 프로모션/이벤트 페이지
- 공지/메시지/고객센터
- 책임 게임 정책 페이지
- 딥링크 랜딩
- 모바일 웹 결제 진입 전 화면
- API 상태 검증

### B. Playwright Plus Native Helper

Playwright만으로는 부족하지만, ADB나 네이티브 helper를 붙이면 1차 후보가 될 수 있다.

- 앱 실행
- 딥링크 실행
- 앱 foreground/background 전환
- WebView 진입 전 네이티브 경로
- 기기 locale/timezone 변경
- 간단한 OS 네트워크 상태 변경

대표 후보:

- 앱 실행 후 WebView 화면 도달
- 딥링크로 프로모션 화면 열기
- 로그인 후 앱 재실행 시 세션 유지 확인
- 네트워크 offline 상태에서 오류 메시지 확인

### C. Native Automation Candidate

Playwright 중심 전략에서는 바로 자동화하지 않고, 입사 후 도구 검토 대상으로 둔다.

- 순수 네이티브 로비
- 게임 리스트 탐색이 네이티브 컴포넌트인 경우
- 인앱결제 UI
- 푸시 알림
- OS 권한 팝업
- 앱 업데이트 플로우

후보 도구:

- Appium
- Maestro
- 사내 mobile automation framework
- Firebase Test Lab

### D. Manual or Exploratory First

자동화 효율이 낮거나 안전 리스크가 큰 영역이다.

- 실제 베팅
- 실제 결제
- 랜덤성이 강한 보상 결과
- 장시간 게임 플레이
- 시각적 품질 평가
- 게임 밸런스/재미 판단
- 운영 이벤트의 일회성 검증

## 5. Candidate Matrix

| Scenario | Criticality | Repeatability | Determinism | Tool Fit | Data Safety | Maintenance | Execution | Observability | Total | Decision |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| App launches without crash | 2 | 2 | 2 | 1 | 2 | 2 | 2 | 2 | 15 | 1차 자동화 |
| Login with QA account | 2 | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 15 | 1차 자동화 |
| Guest entry | 1 | 2 | 2 | 2 | 2 | 1 | 2 | 2 | 14 | 1차 자동화 |
| Home lobby loaded | 2 | 2 | 1 | 1 | 2 | 1 | 2 | 2 | 13 | 1차 자동화 |
| Promo list opens | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 15 | 1차 자동화 |
| Promo detail opens from deeplink | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 15 | 1차 자동화 |
| Notice/support page opens | 1 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 15 | 1차 자동화 |
| Responsible gaming page opens | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 16 | 1차 자동화 |
| Wallet page opens | 2 | 2 | 2 | 1 | 2 | 1 | 2 | 2 | 14 | 1차 자동화 |
| Purchase entry before payment | 2 | 2 | 2 | 1 | 2 | 1 | 1 | 2 | 13 | 조건부 자동화 |
| Sandbox purchase completion | 2 | 1 | 1 | 1 | 2 | 1 | 1 | 2 | 11 | 조건부 자동화 |
| Real purchase | 2 | 0 | 1 | 0 | 0 | 0 | 0 | 1 | 4 | 제외 |
| Real betting | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 3 | 제외 |
| Game launches to first playable screen | 2 | 1 | 1 | 0 | 2 | 0 | 1 | 1 | 8 | 수동 QA + 재검토 |
| Game outcome validation | 2 | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 4 | 제외 |
| Push notification delivery | 1 | 1 | 1 | 0 | 2 | 1 | 1 | 1 | 8 | native 도구 검토 |
| Offline error message | 1 | 2 | 2 | 1 | 2 | 1 | 2 | 2 | 13 | 조건부 자동화 |
| Session persists after restart | 2 | 2 | 2 | 1 | 2 | 1 | 2 | 2 | 14 | 1차 자동화 |
| Age gate blocks underage user | 2 | 2 | 2 | 1 | 2 | 1 | 2 | 2 | 14 | 1차 자동화 |
| Region restriction message | 2 | 1 | 2 | 1 | 2 | 1 | 1 | 2 | 12 | 조건부 자동화 |

## 6. First Automation Backlog

### P0: Start Here

- 앱 실행 후 crash 없이 첫 화면 도달
- QA 계정 로그인
- 홈/로비 주요 UI 로딩
- 책임 게임 페이지 접근
- 지갑/칩 페이지 접근
- 로그아웃

### P1: Playwright Value Is High

- 프로모션 목록 진입
- 프로모션 상세 진입
- 프로모션 딥링크 진입
- 공지/메시지 진입
- 고객센터/FAQ 진입
- 앱 재실행 후 세션 유지
- 오프라인 상태 오류 메시지

### P2: Conditions Needed

- 구매 진입 전 단계 확인
- 결제 sandbox 확인
- 지역 제한 메시지
- 연령 제한 메시지
- 보상 상태 read-only 확인

### Out of Scope for 1st Phase

- 실제 결제
- 실제 베팅
- 실제 자산 차감/증가
- 장시간 게임 플레이
- 게임 결과 검증
- 일회성 운영 이벤트 전체 자동화

## 7. Phase Plan

### Phase 0: Discovery

목표는 자동화 가능성 확인이다.

- Playwright 사내 사용 방식 확인
- Android 앱 WebView 여부 확인
- 테스트 계정/환경 확인
- 안전하게 실행 가능한 시나리오 목록 확정
- P0 smoke 5개 선정

### Phase 1: Playwright Smoke

목표는 짧고 매일 돌릴 수 있는 테스트다.

- 로그인 fixture 구성
- 홈 도달 검증
- 프로모션/공지/책임 게임/지갑 화면 접근 검증
- 실패 artifact 수집
- 로컬 실행 명령 정리

### Phase 2: CI and Stability

목표는 팀이 신뢰하는 자동화로 만드는 것이다.

- nightly smoke job 구성
- flaky test 기준 정의
- retry/trace/video 정책 정리
- 테스트 데이터 reset 방식 연결
- 실패 알림 채널 연결

### Phase 3: Native Gap Analysis

목표는 Playwright 밖 영역을 분류하는 것이다.

- 네이티브 화면 자동화 후보 선정
- Appium/Maestro/사내 도구 비교
- 결제 sandbox 자동화 가능성 검토
- 푸시/권한/업데이트 테스트 전략 수립

## 8. Go or No-Go Rules

### Go

- WebView 또는 모바일 웹으로 접근 가능하다.
- 테스트 계정으로 반복 가능하다.
- 실자산 변경이 없다.
- 기대 결과가 명확하다.
- 실패 시 screenshot/trace/log로 원인 파악이 가능하다.

### No-Go

- 실제 결제가 발생한다.
- 실제 베팅 또는 칩 차감이 발생한다.
- 테스트 결과가 랜덤에 의존한다.
- 법적/정책적 기대값이 확정되지 않았다.
- 실패 원인을 자동으로 관찰할 방법이 없다.

### Hold

- sandbox가 필요하지만 아직 없다.
- WebView 여부가 확인되지 않았다.
- 테스트 계정 상태가 매번 달라진다.
- 사내 정책 검토가 필요하다.
- 네이티브 도구 도입 여부를 결정해야 한다.

## 9. Practical First Step

입사 후 첫 자동화 후보는 아래 5개가 가장 좋다.

| Order | Test | Why |
|---:|---|---|
| 1 | 앱 실행 후 crash 없이 첫 화면 도달 | 모든 테스트의 출발점이다 |
| 2 | QA 계정 로그인 | 세션 기반 테스트의 공통 fixture가 된다 |
| 3 | 홈/로비 로딩 | 가장 넓은 사용자 영향도를 가진다 |
| 4 | 책임 게임 페이지 접근 | 카지노 앱에서 정책 리스크가 크다 |
| 5 | 프로모션 또는 지갑 페이지 접근 | 매출/운영 영향도가 크고 Playwright 적합성이 높다 |

이 5개가 안정화되면 자동화의 첫 성과로 충분하다. 이후에는 프로모션 딥링크, 세션 유지, 결제 진입 전 검증, 지역/연령 제한 순서로 확장한다.
