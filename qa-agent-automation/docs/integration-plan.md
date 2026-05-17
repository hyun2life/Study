# Integration Plan

이 문서는 현재 mock 기반 구조를 회사 환경의 실제 API와 연결할 때의 구현 순서와 결정 사항을 정리합니다.

## 1. GitHub Issue 수집

현재 위치: `app/tools/github_client.py`, `app/agents/collector_agent.py`

권장 구현 순서:

1. `.env`에 `GITHUB_TOKEN`, `GITHUB_OWNER`, `GITHUB_REPO`를 추가합니다.
2. `app/tools/issue_provider.py`의 `RealGitHubIssueProvider`에 실제 호출을 구현합니다.
3. GitHub REST API 또는 GraphQL API에서 open issue를 조회합니다.
4. GitHub API 응답을 `Issue` Pydantic schema로 정규화합니다.
5. label, milestone, assignee, updated time 기준 필터를 config로 분리합니다.
6. pagination과 rate limit 처리를 추가합니다.

권한 선택:

| 방식 | 장점 | 주의사항 |
| --- | --- | --- |
| Personal Access Token | 빠른 내부 검증에 적합 | 개인 계정 의존성이 생길 수 있음 |
| Fine-grained PAT | 저장소 단위 권한 제한 가능 | 만료와 scope 관리 필요 |
| GitHub App | 회사 운영 환경에 가장 적합 | 초기 설정이 조금 더 필요 |

최소 권한은 읽기 전용 Issue 접근으로 시작하는 것이 좋습니다.

## 2. QA 분류 고도화

현재 위치: `app/agents/classifier_agent.py`

현재는 label과 title/body 키워드 기반으로 분류합니다. 회사 환경에서는 아래 순서로 확장하는 것이 안전합니다.

1. 기존 rule 기반 분류를 baseline으로 유지합니다.
2. 회사 label 체계에 맞춰 category/severity mapping을 config로 옮깁니다.
3. 잘못 분류된 사례를 fixture로 쌓아 regression test를 추가합니다.
4. 필요할 때만 LLM 기반 보조 분류를 별도 adapter로 추가합니다.

LLM을 붙이더라도 `ClassifiedIssue` schema는 그대로 유지하는 것이 좋습니다. renderer, reviewer, storage가 분류 방식에 의존하지 않게 됩니다.

## 3. 이메일 전송

현재 위치: `app/tools/email_client.py`, `app/schemas/email.py`

현재는 `YYYY-MM-DD.email.json` dry-run payload만 생성합니다. 실제 전송을 붙일 때는 provider adapter를 분리합니다.

권장 provider 후보:

| 방식 | 적합한 경우 |
| --- | --- |
| SMTP | 사내 SMTP가 이미 있고 설정이 단순할 때 |
| AWS SES | AWS 기반 운영 환경일 때 |
| SendGrid/Mailgun | 외부 이메일 provider를 이미 쓰고 있을 때 |
| Microsoft Graph | 회사 메일이 Microsoft 365 중심일 때 |
| Gmail API | Google Workspace 중심일 때 |

전송 전 확인할 항목:

1. 발신 주소 정책
2. 수신자 그룹 또는 DL 주소
3. 첨부파일 허용 여부
4. HTML 이메일 보안 정책
5. 실패 시 재시도와 알림 방식

## 4. Discord/Slack 전송

현재 위치: `app/tools/messenger.py`

처음에는 Markdown 요약만 전송하고, HTML 파일 링크나 리포트 저장 경로는 별도 필드로 붙이는 형태가 단순합니다.

Slack을 붙일 경우:

1. Incoming Webhook으로 먼저 검증합니다.
2. Block Kit이 필요하면 renderer를 별도로 추가합니다.
3. 채널, mention, 업무 시간 조건을 config로 분리합니다.

Discord를 붙일 경우:

1. Webhook URL을 secret으로 관리합니다.
2. 메시지 길이 제한에 맞춰 summary와 issue detail을 나눕니다.
3. critical/high 이슈만 별도 강조하는 옵션을 둡니다.

## 5. 실행 스케줄

운영 방식은 회사 인프라에 맞춰 고르면 됩니다.

| 방식 | 장점 | 주의사항 |
| --- | --- | --- |
| GitHub Actions schedule | 저장소 안에서 관리하기 쉬움 | 사내망 API 접근이 어려울 수 있음 |
| 사내 cron/server | 네트워크 접근 제어가 쉬움 | 서버 운영 책임 필요 |
| CI/CD 파이프라인 | 배포 흐름과 연결 가능 | 리포트 실행 주기 관리 필요 |
| Workflow scheduler | Airflow, Prefect 등과 통합 가능 | 초기 구성이 큼 |

## 6. 권장 구현 마일스톤

1. 현재 mock 리포트와 회사 label 체계를 비교합니다.
2. `GitHubClient`에 실제 read-only adapter를 추가합니다.
3. 실제 API 결과를 fixture로 저장하지 않고, schema 정규화 테스트만 추가합니다.
4. 이메일은 dry-run payload 검수 후 provider adapter를 붙입니다.
5. Slack/Discord는 critical/high summary부터 작게 시작합니다.
6. 운영 전 production checklist를 통과시킵니다.
