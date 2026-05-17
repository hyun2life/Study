# Company Adoption Guide

이 문서는 입사 직후 회사 저장소에 QA Daily Report Bot을 적용하기 위해 확인할 항목을 순서대로 정리한 가이드입니다. 현재 코드는 mock 기반이므로 실제 secret 없이도 리포트 모양과 실행 흐름을 먼저 보여줄 수 있습니다.

## 첫날 바로 할 일

1. 회사에서 사용하는 GitHub 저장소 이름을 확인합니다.
2. QA label 체계와 severity 기준을 확인합니다.
3. 데일리 리포트를 받을 채널을 정합니다.
4. 이메일, Slack, Discord 중 첫 전송 수단을 하나만 고릅니다.
5. mock 리포트 HTML을 열어 현재 팀 리포트 양식과 비교합니다.

## 팀에 물어볼 질문

| 영역 | 질문 |
| --- | --- |
| 저장소 | 어떤 repository의 issue를 리포트 대상으로 볼 것인가요? |
| 필터 | open issue 전체를 볼지, 특정 label/milestone만 볼지 정해야 하나요? |
| QA 기준 | bug, regression, test gap, flaky test를 어떻게 구분하나요? |
| 심각도 | p0/p1/p2 같은 label이 이미 있나요? |
| 수신자 | 이메일 DL, Slack 채널, Discord 채널 중 어디가 공식 채널인가요? |
| 시간 | 리포트를 매일 몇 시 기준으로 생성해야 하나요? |
| 보안 | issue 본문에 외부 공유가 불가능한 정보가 포함될 수 있나요? |

## 첫 실행 데모

회사 API 정보가 없어도 아래 명령으로 리포트 모양을 바로 보여줄 수 있습니다.

```bash
cd qa-agent-automation
python app/main.py --scenario normal --preview paths --show-paths
python app/main.py --scenario release-risk --preview paths
python app/main.py --scenario quiet --preview paths
```

확인할 파일:

```text
reports/YYYY-MM-DD.md
reports/YYYY-MM-DD.html
reports/YYYY-MM-DD.ko.html
reports/YYYY-MM-DD.json
reports/YYYY-MM-DD.email.json
reports/YYYY-MM-DD.manifest.json
reports/index.html
```

## 실제 GitHub 연동 준비

실제 연동은 `app/tools/issue_provider.py`의 `RealGitHubIssueProvider`에 구현합니다.

처음 구현할 범위:

1. `GITHUB_TOKEN`을 환경변수로 읽습니다.
2. GitHub issue list API를 read-only로 호출합니다.
3. API 응답을 `app.schemas.issue.Issue`로 변환합니다.
4. pagination을 처리합니다.
5. API 장애 시 명확한 에러 메시지를 남깁니다.

기존 `MockGitHubIssueProvider`는 계속 유지합니다. 운영 장애나 renderer 변경 검수 때 외부 API 없이도 테스트할 수 있기 때문입니다.

## 리포트 활용 방식

| 산출물 | 활용 |
| --- | --- |
| Markdown | GitHub comment, Slack/Discord 요약 메시지 |
| HTML | 이메일 본문 또는 브라우저 미리보기 |
| 한글 HTML | 한국어 QA 조직용 이메일 본문 |
| JSON | 사내 대시보드, DB 저장, 후속 자동화 입력 |
| email JSON | 실제 이메일 provider 연결 전 payload 검수 |
| manifest JSON | 생성된 파일 경로 추적 |

## 첫 운영 전 체크

- `python -m pytest`가 통과해야 합니다.
- token은 read-only 최소 권한으로 시작합니다.
- 첫 전송은 테스트 수신자 또는 비공개 채널로 제한합니다.
- HTML 이메일이 회사 메일 클라이언트에서 깨지지 않는지 확인합니다.
- critical/high 기준이 팀의 QA 기준과 맞는지 확인합니다.
- 개인정보, 고객 정보, 보안 이슈 상세가 리포트에 포함될 수 있는지 확인합니다.

## 추천 적용 순서

1. mock HTML 리포트로 팀 피드백을 받습니다.
2. 회사 label 체계를 classifier rule에 반영합니다.
3. GitHub read-only provider를 붙입니다.
4. JSON 산출물을 사내 대시보드나 저장소에 연결합니다.
5. 이메일 dry-run payload를 검수합니다.
6. 실제 이메일 또는 Slack 전송을 켭니다.
7. 스케줄러를 붙여 매일 자동 실행합니다.
