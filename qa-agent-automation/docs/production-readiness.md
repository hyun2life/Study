# Production Readiness

이 체크리스트는 QA Daily Report Bot을 회사 환경에서 실제로 실행하기 전에 확인할 항목입니다.

## 필수 설정

| 항목 | 상태 | 메모 |
| --- | --- | --- |
| `GITHUB_OWNER` | 필요 | 대상 조직 또는 사용자 |
| `GITHUB_REPO` | 필요 | 대상 저장소 |
| `GITHUB_TOKEN` | 실제 연동 시 필요 | 현재 mock 버전에서는 사용하지 않음 |
| `REPORT_TIMEZONE` | 권장 | 기본값 `Asia/Seoul` |
| `REPORT_OUTPUT_DIR` | 권장 | 기본값 `reports` |
| `EMAIL_ENABLED` | 선택 | 실제 provider 구현 전에는 `false` 유지 |
| `EMAIL_RECIPIENTS` | 선택 | 쉼표로 구분한 수신자 목록 |
| `MESSENGER_ENABLED` | 선택 | 실제 messenger 구현 전에는 `false` 유지 |

## Secret 관리

운영 환경에서는 token, webhook, SMTP password를 `.env`나 코드에 직접 커밋하지 않아야 합니다.

권장 위치:

| 환경 | 권장 저장소 |
| --- | --- |
| GitHub Actions | Repository Secrets 또는 Environment Secrets |
| 서버/cron | OS secret manager 또는 배포 시스템 secret |
| Kubernetes | Secret 또는 외부 secret manager |
| 사내 CI/CD | 해당 플랫폼의 secret vault |

## 실행 전 검수

1. `python app/main.py --scenario normal --preview paths`로 기본 산출물을 확인합니다.
2. `python app/main.py --scenario release-risk --preview paths`로 위험도가 높은 리포트 모양을 확인합니다.
3. `python app/main.py --scenario quiet --preview paths`로 이슈가 적은 날의 모양을 확인합니다.
4. `reports/YYYY-MM-DD.ko.html`을 브라우저에서 열어 한글 HTML 이메일 가독성을 확인합니다.
5. `reports/YYYY-MM-DD.email.json`에서 subject, recipients, attachments가 예상대로인지 확인합니다.
6. `pytest`를 실행해 orchestrator, renderer, CLI 테스트를 통과시킵니다.

## 운영 모드 전환 기준

아래 항목이 준비되기 전까지는 dry-run으로 유지하는 것이 좋습니다.

| 영역 | 전환 기준 |
| --- | --- |
| GitHub | 실제 API 결과가 `Issue` schema로 안정적으로 정규화됨 |
| 분류 | 회사 label 체계와 severity mapping이 합의됨 |
| 이메일 | 테스트 수신자에게 HTML 렌더링과 첨부 정책 검수 완료 |
| 메신저 | 채널, mention, 메시지 길이 정책 검수 완료 |
| 스케줄 | 실행 시간, 타임존, 실패 알림 기준 합의 |
| 보안 | token scope와 secret 보관 방식 검수 완료 |

## 실패 처리

실제 API 연동 후에는 아래 실패 경로를 명확히 다루어야 합니다.

| 실패 | 권장 처리 |
| --- | --- |
| GitHub API rate limit | 재시도 없이 실패를 기록하고 다음 실행에서 복구 |
| 인증 실패 | 즉시 운영 채널에 알림 |
| 일부 issue 파싱 실패 | 실패 항목을 messages 또는 별도 log에 기록하고 나머지는 계속 처리 |
| 이메일 전송 실패 | dry-run payload를 남기고 재전송 가능하게 보관 |
| 리포트 저장 실패 | 프로세스를 실패로 종료해 스케줄러에서 감지 |

## 관측성

최소한 아래 정보는 운영 로그나 manifest에 남기는 것이 좋습니다.

1. 실행 시작/종료 시각
2. 대상 repository
3. 수집 issue 수
4. category/severity 요약
5. 저장된 artifact 경로
6. 이메일 또는 메신저 전송 결과
7. 실패 원인과 provider 응답 코드

## 배포 전 최종 체크

- `.env.example`이 실제 운영 변수와 같은 이름을 안내하는지 확인합니다.
- `EMAIL_ENABLED=false`, `MESSENGER_ENABLED=false` 상태에서 dry-run이 정상인지 확인합니다.
- 실제 token은 read-only 최소 권한으로 시작합니다.
- 첫 운영 실행은 테스트 수신자나 비공개 채널로 제한합니다.
- 리포트 내용에 고객 정보, 개인정보, 보안 취약점 상세가 포함될 수 있는지 확인합니다.
- 생성된 HTML이 회사 메일 클라이언트에서 깨지지 않는지 확인합니다.
