# QA Daily Report Bot

Mock GitHub Issue 데이터를 수집하고, QA 관점으로 분류한 뒤, Markdown과 이메일용 HTML 리포트를 생성하는 Python 프로젝트입니다.

현재 범위에서는 OpenAI API, GitHub API, Discord/Slack 전송을 실제로 호출하지 않습니다. 모든 흐름은 mock issue data로 동작합니다.

## 구조

```text
qa-agent-automation/
├─ app/
│  ├─ main.py
│  ├─ orchestrator.py
│  ├─ config.py
│  ├─ agents/
│  ├─ mock_data/
│  │  └─ issues.py
│  ├─ renderers/
│  │  ├─ base.py
│  │  ├─ markdown_renderer.py
│  │  └─ html_renderer.py
│  ├─ schemas/
│  ├─ storage/
│  └─ tools/
├─ docs/
│  ├─ sample-report.md
│  ├─ sample-report.html
│  └─ sample-report-ko.html
├─ tests/
├─ .env.example
├─ requirements.txt
└─ .gitignore
```

## 설치

```bash
cd qa-agent-automation
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

macOS/Linux에서는 가상환경 활성화 명령만 아래처럼 바꿔 사용하면 됩니다.

```bash
source .venv/bin/activate
```

## 실행

기본 실행은 mock issue 데이터를 기반으로 Markdown 리포트를 콘솔에 출력하고, 리포트 파일들을 `reports/`에 저장합니다.

```bash
python app/main.py
```

생성 파일:

```text
reports/YYYY-MM-DD.md
reports/YYYY-MM-DD.html
reports/YYYY-MM-DD.ko.html
reports/YYYY-MM-DD.manifest.json
```

## CLI 옵션

저장소명, 제목, 출력 폴더를 실행 시점에 바꿀 수 있습니다.

```bash
python app/main.py --owner my-org --repo my-repo --title "QA 일일 리포트"
python app/main.py --output-dir demo-reports --show-paths
```

미리보기 출력 형식을 선택할 수 있습니다.

```bash
python app/main.py --preview markdown
python app/main.py --preview html
python app/main.py --preview html-ko
python app/main.py --preview paths
```

한국어 HTML만 저장하는 데모도 가능합니다.

```bash
python app/main.py --ko-only --preview paths --open-html ko
```

저장 옵션:

```bash
python app/main.py --no-markdown
python app/main.py --no-html
python app/main.py --no-ko-html
python app/main.py --no-manifest
```

## 샘플 리포트

GitHub에서 바로 볼 수 있는 샘플을 포함했습니다.

- `docs/sample-report.md`
- `docs/sample-report.html`
- `docs/sample-report-ko.html`

## 테스트

```bash
pytest
```

부모 폴더에서도 아래 방식으로 실행할 수 있습니다.

```bash
qa-agent-automation\.venv\Scripts\python -m pytest qa-agent-automation\tests
```

## 환경 변수

```bash
REPORT_TIMEZONE=Asia/Seoul
REPORT_OUTPUT_DIR=reports
SAVE_REPORT_TO_FILE=true
SAVE_HTML_REPORT_TO_FILE=true
SAVE_KOREAN_HTML_REPORT_TO_FILE=true
SAVE_MANIFEST_TO_FILE=true
```

## 확장 지점

- `app/tools/github_client.py`: 실제 GitHub API 연동 위치
- `app/tools/messenger.py`: Discord, Slack, 이메일 전송 연동 위치
- `app/agents/classifier_agent.py`: QA 분류 규칙 또는 향후 LLM 기반 분류 로직 위치
- `app/mock_data/issues.py`: mock issue data 관리 위치
- `app/renderers/`: Markdown, 영어 HTML, 한국어 HTML 출력 포맷 관리 위치
- `app/storage/report_store.py`: 리포트 파일과 manifest 저장 위치
