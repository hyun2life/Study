# Data Contract

이 문서는 QA Daily Report Bot이 mock 데이터에서 시작해 실제 GitHub, 이메일, 메신저 연동으로 확장될 때 유지해야 하는 데이터 계약을 정리합니다.

## 입력: Issue

`app/schemas/issue.py`의 `Issue` 모델이 모든 수집 데이터의 표준 형식입니다. 실제 GitHub API를 붙이더라도 collector 단계에서는 아래 형태로 정규화해야 합니다.

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | `int` | 예 | GitHub Issue의 내부 ID 또는 이에 준하는 고유 ID |
| `number` | `int` | 예 | 저장소 내 Issue 번호 |
| `title` | `str` | 예 | Issue 제목 |
| `body` | `str` | 아니오 | Issue 본문, 없으면 빈 문자열 |
| `labels` | `list[str]` | 아니오 | GitHub label 이름 목록 |
| `author` | `str` | 예 | Issue 작성자 로그인 |
| `assignees` | `list[str]` | 아니오 | 담당자 로그인 목록 |
| `milestone` | `str \| None` | 아니오 | 연결된 milestone 제목 |
| `url` | `HttpUrl` | 예 | 브라우저에서 열 수 있는 Issue URL |
| `state` | `"open" \| "closed"` | 아니오 | 현재 상태, 기본값은 `open` |
| `created_at` | `datetime` | 예 | 생성 시각 |
| `updated_at` | `datetime` | 예 | 마지막 수정 시각 |

## 처리 결과: ClassifiedIssue

분류 단계는 원본 Issue를 변경하지 않고 `ClassifiedIssue`로 감쌉니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `issue` | `Issue` | 원본 Issue |
| `category` | `QaCategory` | QA 관점의 분류 |
| `severity` | `Severity` | 리포트 우선순위 산정용 심각도 |
| `qa_notes` | `str` | 분류 근거와 QA 관찰 메모 |
| `recommended_action` | `str` | 다음 액션 |

현재 허용되는 `QaCategory` 값은 `bug`, `regression`, `test_gap`, `flaky_test`, `documentation`, `enhancement`, `unknown`입니다.

현재 허용되는 `Severity` 값은 `critical`, `high`, `medium`, `low`입니다.

## 출력: QaReport

`ReporterAgent`는 분류된 이슈와 리뷰 finding을 모아 `QaReport`를 생성합니다.

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `title` | `str` | 리포트 제목 |
| `repository` | `str` | `owner/repo` 형식의 저장소명 |
| `generated_at` | `datetime` | 리포트 생성 시각 |
| `summary` | `ReportSummary` | 전체 개수, category별 개수, severity별 개수 |
| `issues` | `list[ClassifiedIssue]` | 상세 이슈 목록 |
| `findings` | `list[ReviewFinding]` | QA 리뷰 요약 finding |

## 저장 산출물

기본 실행은 `reports/`에 아래 파일을 생성합니다.

| 파일 | 목적 |
| --- | --- |
| `YYYY-MM-DD.md` | 콘솔, GitHub comment, 텍스트 메신저용 Markdown |
| `YYYY-MM-DD.html` | 영문 이메일 미리보기용 HTML |
| `YYYY-MM-DD.ko.html` | 한글 이메일 미리보기용 HTML |
| `YYYY-MM-DD.email.json` | 향후 이메일 provider에 전달할 dry-run payload |
| `YYYY-MM-DD.manifest.json` | 생성 산출물 경로 목록 |
| `index.html` | 여러 리포트를 브라우저에서 빠르게 확인하는 인덱스 |

## Mock 시나리오

`app/mock_data/issues.py`는 실제 API 없이도 리포트 모양을 검수할 수 있도록 시나리오를 제공합니다.

| 시나리오 | 목적 |
| --- | --- |
| `normal` | 일반적인 QA 일일 리포트 형태 확인 |
| `release-risk` | 릴리스 전 critical/high 이슈가 많은 상황 확인 |
| `quiet` | 이슈가 적은 조용한 날의 리포트 확인 |

실제 GitHub 연동을 추가할 때도 테스트에서는 이 mock 시나리오를 유지하는 것이 좋습니다. 외부 API 장애와 무관하게 report renderer, classifier, orchestrator를 안정적으로 검증할 수 있기 때문입니다.
