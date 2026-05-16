# QA Daily Report Bot

Mock 기반으로 GitHub Issue를 수집하고, QA 관점에서 분류한 뒤, Markdown 일일 리포트를 생성하는 Python 프로젝트입니다.

현재 범위에서는 OpenAI API, GitHub API, Discord/Slack 전송을 실제로 호출하지 않습니다. 모든 흐름은 mock issue data로 동작합니다.

## 구조

```text
qa-agent-automation/
├─ app/
│  ├─ main.py
│  ├─ orchestrator.py
│  ├─ config.py
│  ├─ agents/
│  │  ├─ collector_agent.py
│  │  ├─ classifier_agent.py
│  │  ├─ reporter_agent.py
│  │  └─ reviewer_agent.py
│  ├─ tools/
│  │  ├─ github_client.py
│  │  └─ messenger.py
│  ├─ schemas/
│  │  ├─ issue.py
│  │  ├─ report.py
│  │  └─ state.py
│  └─ storage/
│     └─ run_store.py
├─ tests/
│  └─ test_orchestrator.py
├─ .env.example
├─ requirements.txt
├─ README.md
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

프로젝트 루트에서 아래 명령을 실행하면 mock issue 데이터를 기반으로 Markdown 리포트가 콘솔에 출력됩니다.

```bash
python app/main.py
```

또는 모듈 방식으로 실행할 수도 있습니다.

```bash
python -m app.main
```

## 테스트

```bash
pytest
```

## 확장 지점

- `app/tools/github_client.py`: 실제 GitHub API 연동 위치
- `app/tools/messenger.py`: Discord 또는 Slack 전송 연동 위치
- `app/agents/classifier_agent.py`: QA 분류 규칙 또는 향후 LLM 기반 분류 로직 위치
- `app/storage/run_store.py`: 파일, DB, S3 등 영속 저장소로 교체할 위치

