# AI_GAME_QA_TestCase — TC Team v2

<a href="https://claude.ai/code">
  <img src="https://img.shields.io/badge/Built%20with-Claude%20Code-7C3AED?style=for-the-badge&logo=anthropic&logoColor=white" height="40">
</a>
&nbsp;
<a href="https://tc-team-v2-landing.vercel.app/">
  <img src="landing-button.svg" height="60" alt="Landing page">
</a>

> **멀티 에이전트, 멀티 모델 기반 게임 QA 테스트 케이스 자동화 파이프라인.**
> 기획서(Confluence / PDF / Word / Excel)를 넣기만 하면, 검수가 완료된 **300개 이상의 테스트 케이스(TC) Google 스프레드시트**를 수동 조작 없이 완전히 자동화되어 받아볼 수 있습니다.

[![Landing](https://img.shields.io/badge/Landing-tc--team--v2--landing.vercel.app-10B981?style=flat)](https://tc-team-v2-landing.vercel.app/)
[![Docs — Architecture](https://img.shields.io/badge/docs-ARCHITECTURE.md-blue?style=flat)](docs/ARCHITECTURE.md)
[![Docs — Setup](https://img.shields.io/badge/docs-SETUP.md-blue?style=flat)](docs/SETUP.md)
[![Docs — Prerequisites](https://img.shields.io/badge/docs-PREREQUISITES.md-blue?style=flat)](docs/PREREQUISITES.md)

---

## ⚡ 요약 (TL;DR)

- **7단계 멀티 에이전트 파이프라인** — 분석 및 설계 단계(STEP 1)에는 Claude Opus를 사용하고, 나머지 모든 단계에는 Sonnet을 사용합니다.
- **4가지 입력 포맷 지원** — Confluence URL / PDF / Word (`.doc`, `.docx`) / Excel (`.xlsx`, `.xls`)을 자동으로 감지하여 분석합니다.
- **스마트 모델 라우팅** — 깊은 추론이 필요한 단계(STEP 1)에는 Opus를 라우팅하고, 다른 단계는 Sonnet을 사용합니다. Claude Code CLI를 통해 호출되며 외부 API 호출이 필요하지 않습니다.
- **하이브리드 서브에이전트 + 오케스트레이터 패턴** — 오케스트레이터가 각각의 워커(Worker) 에이전트를 독립된 `claude` CLI 프로세스로 실행합니다.
- **이어하기(Resume) 로직** — `state.json`을 통한 체크포인트 기반 상태 관리로, 실행 중단 시 마지막으로 성공한 단계부터 이어서 실행할 수 있습니다.
- **SSoT(단일 진실 공급원) 규칙 관리** — 각 단계별로 하나의 규칙(Skill) 파일만 사용하며, 에이전트 실행 시 실시간으로 규칙 변경 사항을 감지하여 다시 로드합니다.
- **자동 마무리 프로세스** — 마스터 대시보드 갱신 + K/L 프로젝트 패널 업데이트 + Google 드라이브 동기화를 자동 실행합니다.
- **초기 링크 2개 입력 외 조작 필요 없음** (300개 TC 생성 시 필요한 실질적인 사람의 개입 시간은 단 ~1분 내외)

---

## 📊 측정 메트릭 (300개 TC 피처 실행 기준)

| 메트릭 | 수동 QA | TC Team v2 | 변화량 (Δ) |
|--------|:---:|:---:|:---:|
| 엔지니어 투입 시간 | ~3시간 | ~40분 | **~80% ↓** |
| 실제 사람이 클릭/타이핑한 시간 | ~3시간 | **~1분** | **~180배 ↓** |
| 리뷰 라운드 | 1회 (수동) | 2회 (자동, R2+수정 병합) | 2배 |
| 대시보드 / 드라이브 동기화 | 수동 | 자동 | 무한대 |
| 지원 입력 포맷 | 1개 | **4개** | — |
| 중단 시 이어하기 기능 | ❌ | ✅ 체크포인트 기반 | — |
| 외부 API/서버 필요 여부 | — | **없음** (Claude Code CLI 전용) | — |

3년 차 시니어 QA 엔지니어 수준의 결과물 품질을 벤치마킹했습니다. 용어 일관성, 검증 가능성, 스펙 커버리지 및 EVAL 01~11 기준을 모두 만족하거나 그 이상의 수준으로 측정되었습니다.

---

## 🏗 아키텍처

![TC Team v2 파이프라인](assets/pipeline-diagram.png)

**하이브리드 서브에이전트 + 오케스트레이터 패턴**입니다. `tc-팀-v2`는 메인 Claude에서 Task 도구를 통해 호출되어 독립된 컨텍스트에서 실행되며, 내부적으로는 Bash를 통해 개별 단계를 수행할 전담 워커 에이전트를 **별도의 `claude` CLI 프로세스**로 생성합니다. 각 워커는 독립된 컨텍스트 창을 가지며, 오케스트레이터는 각 단계 전환 전에 `state.json`에 체크포인트를 기록하여 재시작 시 마지막으로 성공했던 단계부터 이어갈 수 있도록 합니다.

### 파이프라인 단계

| 번호 | 단계 | 에이전트 | 모델 | 조건부 실행 | 소요 시간 |
|---|-------|-------|-------|-------------|:---:|
| INIT | 워크스페이스 초기화 및 스펙 분석 준비 | orchestrator | Node.js + MCP | — | — |
| 1 | 기획서 분석 및 TC 설계 | `tc-designer-v2` | Claude Opus · `effort:med` | — | ~40분 |
| 2 | 설계 검수 (C-01 ~ C-10) | `tc-설계검수-v2` | Claude Sonnet | — | ~10분 |
| 3 | 설계 수정 (최대 1회) | `tc-designer-v2` | Claude Sonnet | `needs_fix == true` | ~10분 |
| 4 | TC 작성 → Google Sheets 반영 | `tc-writer-v2` | Claude Sonnet | — | ~3분 |
| 5 | 리뷰 R1 (구조 검수) | `qa-reviewer-v2` | Claude Sonnet | — | ~10분 |
| 6 | 수정 R1 | `tc-fixer-v2` | Claude Sonnet | `issues > 0` | ~2분 |
| 7 | 리뷰 R2 + 수정 R2 (원컨텍스트 병합 실행) | `tc-리뷰2수정2-v2` | Claude Sonnet | — | ~10분 |
| DONE | 대시보드 갱신 + K·L 패널 + 드라이브 동기화 | orchestrator | Node.js | — | ~2분 |

자세한 데이터 흐름 다이어그램, 이어하기 로직 구현 및 오케스트레이션 내부 세부 정보는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)를 참고하세요.

---

## 🧠 스마트 모델 라우팅 - 설계 배경

모든 단계에 동일한 모델을 사용하지 않습니다. 각 모델의 장점을 극대화하여 배치했습니다:

| 모델 | 역할 | 해당 단계 |
|-------|------|--------|
| **Claude Opus** | 깊은 추론 — 기획서 분석 및 설계 단계 | STEP 1 |
| **Claude Sonnet** | 균형 잡힌 성능 — 기타 모든 단계 | STEP 2, 3, 4, 5, 6, 7 |

- **Opus 처리 업무**: 기획서 분석 (복잡한 판단이 필요하여 `--effort medium` 옵션 사용)
- **Sonnet 처리 업무**: 설계 검수, TC 작성, 리뷰, 수정사항 반영, 병합 리뷰+수정 프로세스

모든 모델은 **Claude Code CLI**(`claude --model <model> --agent <agent>`)를 통해 직접 호출하므로 외부 API 키나 SDK 의존성, 로컬 모델 서버 구축이 전혀 필요하지 않습니다.

| 단계 | 변경 전 (v1 — 로컬 Gemma4) | 변경 후 (v2 — Sonnet CLI) | 개선 효과 |
|-------|:---:|:---:|:---:|
| STEP 4 TC 작성 | Gemma4 · ~10분 소요 · 프림블 버그 발생 | Sonnet CLI · ~3분 소요 · 깔끔한 결과물 출력 | 3배 이상 빠름, 버그 없음 |
| STEP 6 수정 R1 | Gemma4 · ~10분 소요 · 할당량 제한 문제 | Sonnet CLI · ~2분 소요 · 할당량 제한 없음 | 5배 이상 빠름, 안정적임 |
| 설치 및 세팅 복잡도 | Ollama 설치 + VRAM 확보 + API 키 필요 | 없음 (Claude Code 내장 기능 활용) | 세팅 단계 제로 |

---

## 🚀 빠른 시작 (Quick Start)

[Claude Code](https://claude.ai/code)가 설치되어 있다고 가정합니다. 그 외 필요한 설정은 셋업 스크립트가 자동으로 처리합니다.

```bash
git clone https://github.com/nobles92ts-ship-it/AI_GAME_QA_TestCase.git
cd AI_GAME_QA_TestCase

# Windows 환경
.\setup.ps1

# macOS / Linux 환경
bash ./setup.sh
```

셋업 스크립트 실행 시 다음 작업들이 진행됩니다:
- Node.js 및 Claude Code CLI 경로 자동 감지
- `~/.claude/` 경로에 에이전트, 스킬, 명령어를 복사 및 설치
- 템플릿 파일 내의 `{NODE_PATH}`, `{CLI_JS}`, `{WORK_ROOT}`, `{CLAUDE_HOME}`, `{CONFLUENCE_SITE}`, `{MASTER_DASHBOARD_ID}` 플레이스홀더를 실제 값으로 치환
- 템플릿을 기반으로 `.env` 및 `pipeline_config.json` 생성
- `npm install` 실행

이후 Claude Code 환경에서 다음과 같이 명령어를 실행합니다:

```
/tc-v2 <google-sheets-url> <spec-source> [<spec-source-2> ...]
```

`<spec-source>`에는 다음과 같은 경로들이 입력될 수 있습니다:

```
Confluence URL         https://yoursite.atlassian.net/wiki/spaces/.../pages/111
PDF 파일               C:/specs/feature.pdf
Word 문서              /home/you/specs/feature.docx
Excel 스프레드시트      "C:/my specs/matrix.xlsx"
```

여러 소스를 한 번에 입력하여 배치 작업을 수행할 수 있습니다. 오케스트레이터가 입력을 차례대로 순회하며, 각 기능 기획서마다 독립된 상태값(State)을 갖고 개별 파이프라인으로 실행됩니다.

상세한 시작 방법은 [docs/SETUP.md](docs/SETUP.md)를, 의존성 패키지에 대한 상세한 정보는 [docs/PREREQUISITES.md](docs/PREREQUISITES.md)를 참고하세요.

### MCP 서버 등록

`~/.claude/.mcp.json` 파일에 아래 두 가지 MCP 서버가 등록되어 있어야 합니다 (템플릿: [`.mcp.json.example`](.mcp.json.example)):

```json
{
  "mcpServers": {
    "google-sheets": {
      "command": "node",
      "args": ["<NPM_GLOBAL>/mcp-google-sheets/dist/index.js"],
      "env": {
        "GOOGLE_SHEETS_CLIENT_ID": "...",
        "GOOGLE_SHEETS_CLIENT_SECRET": "...",
        "TOKEN_PATH": "<HOME>/.mcp-google-sheets-token.json"
      }
    },
    "claude_ai_Atlassian": { "...": "..." }
  }
}
```

`google-sheets` 및 `Atlassian`은 서드파티 모듈이거나 Claude Code의 내장 기능을 사용합니다. 로컬 모델 서버(Ollama 등)는 불필요하며, 모든 모델 호출은 Claude Code CLI를 통해 처리됩니다.

---

## 🛠 기술 스택

| 레이어 | 기술 |
|-------|------|
| 에이전트 실행 환경 | Claude Code CLI (Opus 4.6 · Sonnet 4.6) |
| 오케스트레이션 | Bash + Node.js (CLI 프로세스 생성, 상태 영속화, Bash↔MCP 브릿징) |
| 입력 파서 | `xlsx` (Excel) · `pdf-parse` / `pdfjs-dist` (PDF) · `mammoth` (Word) · MCP (Confluence ADF) |
| 출력 포맷 | `googleapis` 라이브러리를 통한 Google Sheets API |
| MCP 연동 | `google-sheets` (서드파티), `claude_ai_Atlassian` |

---

## 🗺 리포지토리 구조

```
AI_GAME_QA_TestCase/
├── agents/                        # Claude 에이전트 정의 정의서 파일
│   ├── tc-팀-v2.md                # 오케스트레이터 — state.json 관리 및 워커 실행 담당
│   ├── tc-designer-v2.md          # STEP 1 / STEP 3 수행
│   ├── tc-설계검수-v2.md          # STEP 2 — 설계 품질 게이트 검수 (C-01~C-10)
│   ├── tc-writer-v2.md            # STEP 4 — TC 최종 작성 에이전트 (Sonnet)
│   ├── qa-reviewer-v2.md          # STEP 5 — 구조적 리뷰 진행
│   ├── tc-fixer-v2.md             # STEP 6 — 수정안 적용 (Sonnet)
│   ├── tc-리뷰2수정2-v2.md        # STEP 7 — R2 리뷰 및 수정 병합 단계
│   └── tc-updater-v2.md           # 기획서 변경사항 감지 및 타겟 영역 부분 업데이트
│
├── commands/
│   └── tc-v2.md                   # /tc-v2 슬래시 커맨드 정의 (파이프라인 진입점)
│
├── skills/                        # 단계별 SSoT 규칙(Skill) 파일 모음
│   ├── tc-설계/  tc-생성/  tc-리뷰/  tc-수정/  tc-갱신/  tc-설계검수/
│   ├── haiku/                     # Sonnet writer/fixer용 스킬 규칙 정의 (STEP 4, 6)
│   └── 완료처리/  tc-대시보드/    # 파이프라인 마무리 스킬
│
├── scripts/
│   └── util/                      # Node.js 기반 유틸리티 스크립트
│       ├── google_auth.js         # Google OAuth 인증 흐름 처리 (client_secret & token)
│       ├── update_dashboard.js    # 마스터 대시보드 갱신
│       ├── add_project_info.js    # K/L 프로젝트 패널 정보 삽입
│       ├── upload_md_to_drive.js  # 분석 완료된 마크다운 드라이브 업로드 및 동기화
│       ├── create_gsheet_tc_from_json.js
│       ├── apply_fixes.js
│       ├── read_gsheet_data.js
│       └── v2/                    # 파이프라인 상태 관리 / 품질 게이트 / 시간 측정 기능
│
├── docs/
│   ├── PREREQUISITES.md           # 전체 의존성 패키지 설치 가이드
│   ├── SETUP.md                   # 상세 세부 설정 및 준비 방법
│   └── ARCHITECTURE.md            # 파이프라인 내부 구조 및 데이터 흐름 설명
│
├── credentials/                   # OAuth 인증 파일 저장용 (gitignored, .gitkeep 포함)
├── assets/                        # 파이프라인 아키텍처 다이어그램 이미지 등
├── .env.example
├── .mcp.json.example
├── pipeline_config.json.template
├── package.json                   # npm 패키지 의존성 정의: googleapis, xlsx, pdf-parse 등
├── requirements.txt               # Python 의존성 정의 (옵션 — 로컬 분석 유틸리티용)
├── setup.ps1 / setup.sh           # 운영체제별 설치 및 자동화 스크립트
└── landing-button.svg             # 랜딩 페이지 연결용 배지 이미지
```

---

## 🔮 로드맵 (Roadmap)

### ✅ Phase 1 — 멀티 소스 지원 자동화 & 자동 마무리 (완료)
- Confluence / PDF / Word / Excel 입력 지원 및 Google Sheets 결과물 자동 생성
- 7단계 멀티 에이전트 파이프라인 구축 (STEP 1은 Claude Opus, STEP 2~7은 Sonnet CLI 활용)
- 신속한 품질 루프를 위한 2차 리뷰와 수정을 한 번에 병합 처리
- 대시보드 자동 갱신, K·L 패널 정보 동기화, 구글 드라이브 업로드 자동 완료
- 기획서 변경 시 타겟 영역을 선별 업데이트하는 `tc-updater-v2` 구축 (현재 Confluence 기획서 대상 우선 지원)

### 🔜 Phase 2 — 지능형 TC 관리
- TC 히스토리 버전 제어 및 Diff 뷰어 제공
- 피처 간의 교차 의존성 분석 지원
- 자동화 테스트 전환이 용이한 TC에 대한 자동 분류 기능
- QA 결과 보고서 포맷 자동 생성 (PDF / Markdown / Confluence 형식)
- `tc-updater-v2` 기능 확장을 통한 PDF/Word 기획서 변경 감지 기능 지원

### 🌟 Phase 3 — 물리적 테스트 연동 및 실행
- 작성된 TC로부터 테스트 자동화 스크립트(Script) 자동 생성
- 빌드와 연동하여 자동으로 테스트 실행
- 테스트 실행 결과를 TC 시트상에 자동으로 판정 및 업데이트
- 회귀 테스트 자동화 파이프라인 연동

---

## 🤖 Built with Claude Code

이 프로젝트의 모든 것(에이전트 설정, 오케스트레이션 Bash 코드 블록, Skill 규칙 정의, 각종 기술 문서 등)은 [Claude Code](https://claude.ai/code)를 사용하여 A부터 Z까지 설계, 개발 및 고도화가 진행되었습니다.

개발 환경 구축 없이 시스템의 대략적인 개요나 시각적인 정보가 궁금하신 경우 **[소개 랜딩 페이지](https://tc-team-v2-landing.vercel.app/)**를 방문해 보세요.
