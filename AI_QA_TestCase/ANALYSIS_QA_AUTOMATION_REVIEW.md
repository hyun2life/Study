# AI_GAME_QA_TestCase-main 분석 보고서

## 한줄 결론

이 저장소는 "게임 QA 실행 자동화"보다는 "기획서 기반 테스트케이스 생성/검수/시트 운영 자동화"에 더 가깝다.

- 강점: 멀티 에이전트 분업 구조, 재개 로직, 시트/드라이브 운영 정책이 잘 설계되어 있다.
- 한계: 저장소 단독으로는 바로 실행되기 어렵고, 핵심 보조 스크립트와 설치 흐름 일부가 비어 있다.
- 판단: "운영 설계가 강한 프로토타입" 또는 "내부 PoC를 정리한 저장소"로 보는 것이 가장 정확하다.

## 이 저장소가 실제로 자동화하는 것

현재 구현/문서 기준 자동화 범위는 아래와 같다.

1. 입력 스펙 수집
- Confluence
- PDF
- Word
- Excel

2. AI 기반 중간 산출물 생성
- `analysis.md`
- `tc_design.md`
- 리뷰 보고서
- 수정 보고서

3. Google Sheets 운영 자동화
- TC 탭 생성
- 시트 포맷 적용
- 대시보드 갱신
- 상태 스냅샷 저장

4. 파이프라인 운영 보조
- `state.json` 기반 재개
- 배치 처리
- 비용/안정성 정책

아직 저장소 안에서 직접 구현된 것은 아니다.

- 게임 빌드 실행
- 디바이스/클라이언트 조작
- 자동 리그레션 실행
- TC로부터 실제 테스트 스크립트 생성

즉, "QA 테스트 실행 자동화"보다 "QA 테스트케이스 생산 자동화"에 초점이 있다.

## 구조 요약

핵심 축은 4개다.

1. 에이전트 정의
- `agents/`
- 설계, 설계검수, 작성, 리뷰, 수정, 재리뷰 역할 분리

2. 규칙 문서
- `skills/`
- 단계별 품질 기준과 산출물 규칙을 SSoT처럼 사용

3. 운영 스크립트
- `scripts/`, `scripts/util/`, `scripts/util/v2/`
- Google OAuth, 시트 생성, 대시보드 갱신, 상태 관리

4. 운영 문서
- `docs/`
- 설치, 아키텍처, 안정성 정책

## 강점

### 1. 파이프라인 개념이 선명하다

7단계 흐름이 비교적 명확하다.

- STEP 1: 설계
- STEP 2: 설계 검수
- STEP 3: 설계 수정
- STEP 4: TC 작성
- STEP 5: 1차 리뷰
- STEP 6: 1차 수정
- STEP 7: 2차 리뷰+수정

이 구조는 단순 생성보다 QA 문서 품질을 통제하려는 설계로 읽힌다.

### 2. 실무형 안정성 사고가 많이 반영돼 있다

`docs/stability.md`는 이 저장소에서 가장 실전성이 높은 문서 중 하나다.

- Sheets API quota 대응
- OAuth 만료 처리
- 탭 백업 후 복원 정책
- 컬럼 꼬임 감지
- 비용 상한선
- 재시도 정책
- heartbeat 로그

즉, 단순한 프롬프트 저장소가 아니라 운영 중 겪은 장애를 문서화한 흔적이 있다.

### 3. Google Sheets/Drive 연동은 실제 코드가 있다

다음 스크립트는 실구현으로 보인다.

- `scripts/util/google_auth.js`
- `scripts/util/create_gsheet_tc_from_json.js`
- `scripts/util/update_dashboard.js`
- `scripts/util/read_gsheet_data.js`
- `scripts/util/v2/pipeline_state.js`
- `scripts/util/v2/pipeline_gate.js`
- `scripts/util/v2/pipeline_report.js`

즉, 적어도 시트 생성과 운영 보조 레이어는 문서가 아니라 코드가 존재한다.

## 즉시 실행을 막는 주요 문제

### A. 설치 문서가 참조하는 핵심 파일이 저장소에 없다

다음 파일들이 문서/에이전트에서 중요하게 참조되지만 현재 저장소에는 없다.

- `scripts/preflight/preflight.ps1`
- `scripts/preflight/preflight.sh`
- `install.mjs`
- `scripts/util/run-agent.sh`
- `scripts/util/pipeline_retry.sh`
- `scripts/util/duplicate_tab.js`
- `scripts/util/confluence_image_downloader.py`
- `scripts/util/validate_tc_rows.js`
- `requirements.txt`

영향:

- 설치 절차가 문서대로 재현되지 않는다.
- 팀장 에이전트의 실제 CLI 위임 실행이 불가능하다.
- 재시도/백업/이미지 분석/행 검증 로직이 동작하지 않는다.

### B. `/tc-v2` 명령 배포 경로가 끊겨 있다

저장소에는 `commands/tc-v2.md`가 있다. 하지만 `setup.ps1`, `setup.sh`는 `agents`와 `skills`만 복사하고 `commands`를 복사하지 않는다.

영향:

- 문서상 진입점은 `/tc-v2`인데 실제 설치 스크립트만으로는 해당 명령이 Claude Code에 등록되지 않을 수 있다.

### C. 에이전트가 요구하는 스크립트 옵션과 실제 스크립트 인터페이스가 다르다

`tc-writer-v2.md`는 아래처럼 `read_gsheet_data.js`를 호출하도록 적혀 있다.

- `--columns A,B,C,D,E,F,G,H,I,J`
- `--minify`

하지만 현재 `scripts/util/read_gsheet_data.js`는 `--list`, `--range`만 지원하고 `--columns`, `--minify`는 지원하지 않는다.

영향:

- STEP 4 이후 스냅샷 생성 흐름이 문서대로는 동작하지 않는다.

### D. 루트 스크립트 일부는 아직 템플릿/샘플 상태다

대표 사례:

- `scripts/pipeline_monitor.js`
  - `YOUR_WORK_ROOT` 플레이스홀더가 남아 있다.
- `scripts/create_gsheet_tc.js`
  - `MASTER_SPREADSHEET_ID`가 하드코딩되어 있다.
- `scripts/update_dashboard.js`
  - 기본 스프레드시트 ID가 하드코딩되어 있다.

영향:

- `npm run monitor`, `npm run dashboard` 같은 엔트리가 저장소 그대로는 일반화되어 있지 않다.

## 문서-구현 불일치

### 1. 모델 라우팅 설명이 버전별로 섞여 있다

README는 사실상 "STEP 1만 Opus, 나머지는 Sonnet" 서사다.

하지만 다른 문서에는 아래 흔적이 남아 있다.

- STEP 4, 6은 Haiku 계열로 계산한 비용표
- Gemma4/Ollama 관련 환경변수
- Haiku skill 폴더 이름

해석:

- v1, v2, 전환기 문서가 혼재한 상태다.
- 현재 의도는 Sonnet 중심이지만, 저장소 전체를 보면 완전히 정리되지는 않았다.

### 2. README의 의존성과 `package.json`이 맞지 않는다

README는 다음 파서를 언급한다.

- `xlsx`
- `pdf-parse`
- `pdfjs-dist`
- `mammoth`

하지만 현재 `package.json` 의존성은 아래만 있다.

- `dotenv`
- `googleapis`
- `exceljs`

해석:

- 문서상 지원 포맷 범위가 저장소 현재 상태보다 앞서 있다.
- 또는 관련 구현 파일/의존성이 누락된 상태다.

### 3. SETUP 문서와 실제 setup 스크립트가 다르다

문서에는 preflight와 `install.mjs`가 중심으로 쓰여 있다.

실제 저장소에는 `setup.ps1`, `setup.sh`만 있고 해당 파일들은 없다.

해석:

- 설치 문서가 최신 스크립트를 반영하지 못했거나,
- 반대로 최신 설치 구조가 저장소에 누락되었을 가능성이 높다.

### 4. 모니터 스크립트가 두 벌인데 상태가 다르다

- `scripts/pipeline_monitor.js`: `YOUR_WORK_ROOT`가 남아 있는 루트용 버전
- `scripts/util/pipeline_monitor.js`: `{PROJECT_ROOT}` 플레이스홀더 기반의 util 버전

하지만 `package.json`은 루트 스크립트를 바라본다.

해석:

- 실제 운영본과 배포본이 섞였을 가능성이 있다.

## 성숙도 평가

### 설계 성숙도

높다.

- 역할 분리
- 상태 관리
- 재개 로직
- 장애 대응
- 리뷰 게이트

### 저장소 완결성

낮다.

- 누락 파일 다수
- 하드코딩 잔존
- 인터페이스 불일치
- 설치 엔트리 누락

### 바로 실행 가능성

낮다.

외부에서 이미 갖고 있던 내부 스크립트/Claude 환경이 없으면 저장소 단독 실행은 어렵다.

## 현실적인 해석

이 저장소는 아래 3가지 중 하나로 보는 게 적절하다.

1. 내부 운영 중인 시스템의 공개용/공유용 축약본
2. 문서화는 많이 됐지만 배포 정리가 끝나지 않은 PoC
3. 실제 운영 저장소에서 민감하거나 사내 의존적인 파일이 빠진 상태

가장 가능성이 높은 것은 1 또는 3이다.

## QA 자동화 관점에서의 가치

이 저장소의 가치는 "자동 플레이 테스트"가 아니라 아래에 있다.

- 기획서 해석 표준화
- 테스트케이스 설계 품질 통제
- 시트 운영 자동화
- 리뷰 비용 절감
- 대량 TC 생산의 재현성 확보

즉, QA 자동화 체인에서 "실행 자동화 이전 단계"를 AI로 체계화하려는 시도다.

이건 꽤 의미가 있다. 실제 조직에서는 테스트 실행보다 테스트 설계/정리/동기화에서 시간이 크게 빠지는 경우가 많기 때문이다.

## 추천 보완 순서

### 1순위: 저장소 단독 실행성 복구

- 누락된 스크립트 복원
- `commands/tc-v2.md` 설치 경로 추가
- 하드코딩된 스프레드시트 ID 제거
- monitor/dashboard 엔트리 정리

### 2순위: 문서/구현 동기화

- README와 `package.json` 정합성 맞추기
- Sonnet/Haiku/Gemma4 설명 한 버전으로 통일
- 설치 문서를 실제 setup 흐름 기준으로 재작성

### 3순위: 인터페이스 계약 정리

- `read_gsheet_data.js` 옵션 구현 또는 에이전트 문서 수정
- 누락 유틸인 `validate_tc_rows.js`, `duplicate_tab.js` 등 정리
- 산출물 파일명 규약 검증

### 4순위: 진짜 실행 자동화로 확장

- Appium/Playwright/ADB/WinAppDriver 등과 연결
- TC에서 실행 스크립트로의 변환 규칙 정의
- 결과를 다시 시트에 반영하는 실행 루프 구축

## 최종 판단

이 저장소는 "QA 자동화가 없다"가 아니라, "자동화의 초점이 실행이 아니라 TC 생산과 운영에 있다"가 맞다.

그리고 현재 상태는 "아이디어 문서" 수준은 이미 넘었지만, "다른 사람이 바로 clone 해서 재현 가능한 제품" 수준에는 아직 못 미친다.

따라서 평가를 한 문장으로 요약하면 아래와 같다.

`설계와 운영 철학은 좋고, 저장소 완결성은 아직 부족한 QA TC 자동화 파이프라인 프로토타입`
