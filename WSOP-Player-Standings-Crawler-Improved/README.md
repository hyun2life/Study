# WSOP Player Standings Crawler

WSOP Player Standings 데이터를 크롤링하고 JSON, CSV, HTML 리포트를 생성하는 자동화 도구입니다.

## 팀원 실행 방법

라이브 `wsop.com` 테스트:

```text
RUN_WSOP_PLAYER_CRAWLER_LIVE.bat
```

스테이지 테스트:

```text
RUN_WSOP_PLAYER_CRAWLER.bat
```

처음 실행할 때는 PC 상태에 따라 몇 분 정도 걸릴 수 있습니다. 실행 창은 닫지 말고, 열린 브라우저도 리포트가 생성될 때까지 닫지 마세요.

## 자동 준비되는 항목

BAT 파일을 실행하면 `automation\run_player_standings_crawler.ps1`이 아래 항목을 최대한 자동으로 준비합니다.

- Node.js/npm 확인
- Node.js가 없으면 `winget`으로 Node.js LTS 자동 설치 시도
- `npm ci` 또는 `npm install`로 패키지 설치/복구
- Playwright Chromium 자동 설치
- 출력 폴더 생성
- 크롤러 실행 및 한글 HTML 리포트 열기

회사 보안 정책, 프록시, 권한 문제로 자동 설치가 막힐 수 있습니다. 그 경우 Node.js LTS를 수동 설치하거나 네트워크/프록시 권한을 확인한 뒤 BAT 파일을 다시 실행하면 됩니다.

## 라이브 테스트 범위 조절

`RUN_WSOP_PLAYER_CRAWLER_LIVE.bat` 상단의 값을 바꾸면 실행량을 조절할 수 있습니다.

```bat
set "PLAYER_LIMIT=10"
set "RESULT_LIMIT=0"
set "RESULT_RANK_LIMIT=0"
set "MAX_LOAD_MORE=50"
set "RESULT_PAGE_LIMIT=0"
set "CONCURRENCY=5"
```

각 값의 의미는 아래와 같습니다.

| 값 | 의미 | 현재값 기준 동작 |
| --- | --- | --- |
| `PLAYER_LIMIT` | standings 카테고리별로 가져올 선수 수입니다. 카테고리는 2026 Standings, All-Time Earnings - Men/Women, All-Time Bracelets, All-Time Rings입니다. | 각 카테고리에서 10명씩 가져옵니다. 중복 선수가 있으면 실제 크롤 선수 수는 더 적을 수 있습니다. |
| `RESULT_LIMIT` | 선수 1명당 확인할 `Result` 항목 수입니다. `0`이면 가능한 모든 Result를 확인합니다. | 가능한 모든 Result를 확인합니다. |
| `RESULT_RANK_LIMIT` | Result에서 플레이어 순위가 이 값보다 크면 해당 Result 확인을 건너뜁니다. `0`이면 순위 제한이 없습니다. | 순위 제한 없이 확인합니다. |
| `MAX_LOAD_MORE` | 선수 프로필의 ALL 탭에서 `Load more` 버튼을 최대 몇 번 누를지 정합니다. | 선수 1명당 최대 50번까지 더 불러옵니다. |
| `RESULT_PAGE_LIMIT` | Result 상세 페이지에서 최종 순위표 페이지를 최대 몇 페이지까지 확인할지 정합니다. `0`이면 마지막 페이지까지 확인합니다. | Result마다 제한 없이 확인합니다. |
| `CONCURRENCY` | 동시에 크롤링할 선수 수입니다. 기본값은 정합성과 안정성을 우선한 `5`이며, 코드는 최대 `10`까지 허용합니다. | 선수 5명을 병렬로 확인합니다. |

현재 기본값은 실제 QA 검증용입니다. 빠른 스모크 테스트만 하려면 예를 들어 아래처럼 줄일 수 있습니다.

```bat
set "PLAYER_LIMIT=1"
set "RESULT_LIMIT=1"
set "RESULT_RANK_LIMIT=0"
set "MAX_LOAD_MORE=3"
set "RESULT_PAGE_LIMIT=1"
set "CONCURRENCY=3"
```

## 검증 범위

크롤러는 선수별로 아래 항목을 검증합니다.

- ALL 탭을 펼쳐서 상단 요약값과 계산값을 비교합니다.
- Title, Bracelets, Rings, Final Tables 탭을 각각 눌러서 현재 표시된 row 수가 상단 요약값과 같은지 비교합니다.
- 각 이벤트의 Result 페이지를 열어 최종 결과표에서 선수명, 순위, 상금이 맞는지 확인합니다.

다른 탭들은 일반적으로 row 수가 많지 않기 때문에 `Load more`를 반복하지 않고, 탭 클릭 직후 표시된 row 수를 기준으로 빠르게 검증합니다. ALL 탭은 `Cashes`와 `Total Earnings` 계산에 필요하므로 `MAX_LOAD_MORE` 설정에 따라 더 많이 펼칩니다.

## 출력물

결과 파일은 `automation\output` 아래에 생성됩니다.

```text
*-data.json
*-report.html
*-report-ko.html
*-defects.csv
```

`*-report.html`은 기존 영문 리포트이고, `*-report-ko.html`은 같은 내용을 사람이 보기 쉽게 번역한 한글 리포트입니다. BAT 실행 후에는 한글 리포트를 우선으로 엽니다.

## 자체 검증

브라우저를 열지 않고 로컬 로직만 확인하려면:

```powershell
npm.cmd run crawl:self-test
```
