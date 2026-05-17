# Study

개인 학습, 자동화 실험, 문서화 작업을 모아두는 저장소입니다.

현재는 여러 작은 프로젝트와 실험 폴더가 함께 들어 있으며, 각 프로젝트는 가능하면 독립적으로 실행하고 검수할 수 있도록 구성합니다.

## 주요 프로젝트

### QA Daily Report Bot

위치: [`qa-agent-automation/`](qa-agent-automation/)

GitHub Issue를 수집하고 QA 관점으로 분류한 뒤 Markdown, HTML, 한글 HTML, 이메일 dry-run payload 형태의 데일리 리포트를 생성하는 Python mock 프로젝트입니다.

현재는 실제 OpenAI API, GitHub API, 이메일, Slack, Discord 호출 없이 mock 데이터만으로 전체 흐름을 확인할 수 있습니다.

빠른 실행:

```bash
cd qa-agent-automation
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app/main.py --preview paths --show-paths
```

주요 문서:

- [`qa-agent-automation/README.md`](qa-agent-automation/README.md): 설치, 실행, CLI 옵션
- [`qa-agent-automation/docs/sample-report.md`](qa-agent-automation/docs/sample-report.md): Markdown 샘플 리포트
- [`qa-agent-automation/docs/sample-report.html`](qa-agent-automation/docs/sample-report.html): 영문 HTML 샘플 리포트
- [`qa-agent-automation/docs/sample-report-ko.html`](qa-agent-automation/docs/sample-report-ko.html): 한글 HTML 샘플 리포트
- [`qa-agent-automation/docs/data-contract.md`](qa-agent-automation/docs/data-contract.md): Issue, 분류 결과, 리포트 데이터 계약
- [`qa-agent-automation/docs/integration-plan.md`](qa-agent-automation/docs/integration-plan.md): GitHub, 이메일, Slack/Discord 연동 계획
- [`qa-agent-automation/docs/production-readiness.md`](qa-agent-automation/docs/production-readiness.md): 회사 환경 운영 전 체크리스트
- [`qa-agent-automation/docs/company-adoption-guide.md`](qa-agent-automation/docs/company-adoption-guide.md): 입사 직후 적용 가이드
- [`qa-agent-automation/docs/access-from-company.md`](qa-agent-automation/docs/access-from-company.md): 회사 PC에서 다시 보는 방법

검수:

```bash
cd qa-agent-automation
.venv\Scripts\python -m pytest
```

## 기타 폴더

- [`AI_QA_TestCase/`](AI_QA_TestCase/): QA 테스트 케이스 관련 실험
- [`WSOP-QA-Automation/`](WSOP-QA-Automation/): QA 자동화 관련 작업 공간
- [`SNS_report/`](SNS_report/): SNS 리포트 자동화 실험
- [`daughter-emoticons/`](daughter-emoticons/): 이모티콘 관련 작업
- [`paintjaengi/`](paintjaengi/): 웹/페이지 관련 작업
- [`PM/`](PM/): PM 관련 문서와 제안 자료
- [`ETC/`](ETC/): 기타 실험과 결과물

## 운영 메모

- 각 프로젝트의 상세 실행 방법은 해당 폴더의 README를 우선 확인합니다.
- 생성물, 캐시, 가상환경은 가능한 한 Git에 올리지 않습니다.
- 실제 API token, webhook, 이메일 비밀번호 같은 secret은 `.env`에 넣더라도 커밋하지 않습니다.
