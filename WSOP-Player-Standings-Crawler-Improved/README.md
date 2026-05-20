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

배포받은 사용자는 보통 BAT 파일만 실행하거나 BAT 상단 설정값만 바꾸면 됩니다. `automation` 폴더 안의 `.mjs`, `.ps1` 파일은 개발자가 수정하는 영역이므로 일반 사용자는 건드리지 않아도 됩니다.

### 처음 실행하는 사람을 위한 순서

1. 압축을 풀거나 저장소를 받은 뒤 폴더 안의 `RUN_WSOP_PLAYER_CRAWLER_LIVE.bat`을 더블클릭합니다.
2. 크롬 창이 뜨면 닫지 말고 그대로 둡니다. 로그인이나 접근 확인 화면이 보이면 직접 처리합니다.
3. 검증이 끝나면 `automation\output` 폴더에 리포트가 생성되고, BAT가 한글 리포트를 자동으로 엽니다.
4. 실패 항목이 있으면 열린 한글 리포트의 `누락:` 내용을 확인합니다.
5. 중간에 멈추고 싶으면 BAT 창에서 `Ctrl+C`를 누릅니다. 이미 완료된 선수 기준의 부분 리포트는 남습니다.

### 사용자가 주로 수정하는 위치

라이브 검증 기준으로는 `RUN_WSOP_PLAYER_CRAWLER_LIVE.bat` 상단의 아래 부분만 수정하면 됩니다.

```bat
set "PLAYER_LIMIT=10"
set "RESULT_LIMIT=0"
set "RESULT_RANK_LIMIT=0"
set "MAX_LOAD_MORE=50"
set "RESULT_PAGE_LIMIT=0"
set "CONCURRENCY=8"
```

정합성을 높이고 싶으면 `RESULT_LIMIT=0`, `RESULT_PAGE_LIMIT=0`, `MAX_LOAD_MORE=50` 이상을 유지하는 것을 권장합니다. 빠른 동작 확인만 할 때만 값을 줄이세요.

## 브라우저 표시 여부

기본 BAT는 실제 브라우저 창을 띄워서 실행합니다. 로그인, 접근 확인, 차단 여부를 직접 볼 수 있어서 라이브 검증에는 이 방식이 가장 안전합니다.

```bat
  -Headed ^
```

브라우저 창을 띄우지 않고 백그라운드(headless)로 실행하려면 BAT 파일의 PowerShell 실행 옵션에서 위 줄을 제거하면 됩니다.

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File "%CRAWLER_SCRIPT%" ^
  -PlayersUrl "%PLAYERS_URL%" ^
  -OutputTag "%OUTPUT_TAG%" ^
  -RunId "%RUN_ID%" ^
  -AuthWaitMs 300000 ^
  -Limit %PLAYER_LIMIT% ^
  ...
```

headless 실행에서 로그인/접근 차단 문제가 생기면 다시 `-Headed ^` 줄을 넣고 실행하세요.

배포용으로는 `-Headed ^`를 켜둔 상태를 권장합니다. 사용자는 실제로 페이지가 열리는지, 로그인이 필요한지, 사이트가 막혔는지 눈으로 확인할 수 있기 때문입니다.

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
set "CONCURRENCY=8"
```

각 값의 의미는 아래와 같습니다.

| 값 | 의미 | 현재값 기준 동작 |
| --- | --- | --- |
| `PLAYER_LIMIT` | standings 카테고리별로 가져올 선수 수입니다. 카테고리는 2026 Standings, All-Time Earnings - Men/Women, All-Time Bracelets, All-Time Rings입니다. | 각 카테고리에서 10명씩 가져옵니다. 중복 선수가 있으면 실제 크롤 선수 수는 더 적을 수 있습니다. |
| `RESULT_LIMIT` | 선수 1명당 확인할 `Result` 항목 수입니다. `0`이면 가능한 모든 Result를 확인합니다. | 가능한 모든 Result를 확인합니다. |
| `RESULT_RANK_LIMIT` | Result에서 플레이어 순위가 이 값보다 크면 해당 Result 확인을 건너뜁니다. `0`이면 순위 제한이 없습니다. | 순위 제한 없이 확인합니다. |
| `MAX_LOAD_MORE` | 선수 프로필의 ALL 탭에서 `Load more` 버튼을 최대 몇 번 누를지 정합니다. | 선수 1명당 최대 50번까지 더 불러옵니다. |
| `RESULT_PAGE_LIMIT` | Result 상세 페이지에서 최종 순위표 페이지를 최대 몇 페이지까지 확인할지 정합니다. `0`이면 대상 row를 찾은 뒤에도 마지막 페이지까지 모두 확인하고, 양수이면 해당 페이지 수까지만 확인합니다. | Result마다 제한 없이 끝까지 확인합니다. |
| `CONCURRENCY` | 동시에 크롤링할 선수 수입니다. BAT에서 조절하는 실행 튜닝값이며, 코드는 최대 `10`까지 허용합니다. | 선수 8명을 병렬로 확인합니다. |

정합성을 최우선으로 볼 때는 `RESULT_PAGE_LIMIT=0`을 권장합니다. 실행 시간을 제한해야 하면 `50`처럼 충분히 큰 양수로 두면 최대 50페이지까지만 확인합니다.

현재 기본값은 실제 QA 검증용입니다. 빠른 스모크 테스트만 하려면 예를 들어 아래처럼 줄일 수 있습니다.

```bat
set "PLAYER_LIMIT=1"
set "RESULT_LIMIT=1"
set "RESULT_RANK_LIMIT=0"
set "MAX_LOAD_MORE=3"
set "RESULT_PAGE_LIMIT=1"
set "CONCURRENCY=3"
```

### 추천 설정 예시

정확도를 우선으로 전체 검증에 가깝게 돌릴 때:

```bat
set "PLAYER_LIMIT=10"
set "RESULT_LIMIT=0"
set "RESULT_RANK_LIMIT=0"
set "MAX_LOAD_MORE=50"
set "RESULT_PAGE_LIMIT=0"
set "CONCURRENCY=8"
```

이 설정은 시간이 오래 걸릴 수 있지만, 선수 프로필의 Result와 Result 상세 페이지를 최대한 많이 확인합니다.

빠르게 실행 여부만 확인할 때:

```bat
set "PLAYER_LIMIT=1"
set "RESULT_LIMIT=1"
set "RESULT_RANK_LIMIT=0"
set "MAX_LOAD_MORE=3"
set "RESULT_PAGE_LIMIT=1"
set "CONCURRENCY=3"
```

이 설정은 설치, 브라우저 실행, 리포트 생성 흐름이 정상인지 보는 용도입니다. 실제 정합성 검증용으로는 부족할 수 있습니다.

PC가 느리거나 브라우저 오류가 자주 날 때:

```bat
set "CONCURRENCY=3"
```

`CONCURRENCY`는 동시에 검사하는 선수 수입니다. 값을 높이면 빨라질 수 있지만 PC 부하와 브라우저 오류 가능성도 같이 올라갑니다. 오류가 반복되면 3~5 정도로 낮춰서 다시 실행하세요.

Result 페이지가 매우 길어서 시간이 오래 걸릴 때:

```bat
set "RESULT_PAGE_LIMIT=50"
```

`0`은 제한 없이 끝까지 확인한다는 뜻입니다. 시간이 너무 오래 걸릴 때만 `50`처럼 충분히 큰 값으로 제한하세요. 단, 제한한 페이지 밖에 대상 순위가 있으면 실패로 나올 수 있습니다.

### 자주 보이는 실패 메시지 해석

리포트의 `누락:` 항목은 아래 의미입니다.

| 항목 | 의미 |
| --- | --- |
| `hasFinalResultRows` | Result 상세 페이지에서 최종 결과표 row를 찾지 못했습니다. 페이지 로딩, 접근 차단, 페이지 구조 변경 가능성이 있습니다. |
| `rankMatches` | standings/profile의 순위와 Result 상세 페이지의 순위가 일치하지 않습니다. |
| `playerMatches` | 선수명이 일치하지 않습니다. 닉네임/실명 병기, 특수문자, 사이트 표기 차이를 확인해야 합니다. |
| `earningsMatches` | 상금이 일치하지 않습니다. 달러/유로/파운드 표기나 사이트 원본 값 차이를 확인해야 합니다. |

실패가 나오면 먼저 열린 브라우저에서 해당 `Link`를 직접 확인하고, 실제 페이지에도 같은 값이 보이는지 비교하세요.

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

크롤러는 실행 중에도 선수 1명 검증이 끝날 때마다 JSON, HTML, CSV 리포트를 갱신합니다. 긴 live 검증 중 결함 후보가 보이면 크롤러가 계속 도는 동안에도 `automation\output`의 최신 한글 리포트를 열어 직접 확인할 수 있습니다. `Ctrl+C`로 중단하면 새 선수 작업은 시작하지 않고, 현재까지 완료된 선수 기준으로 `interrupted` 상태의 부분 리포트를 남깁니다.

## 자체 검증

브라우저를 열지 않고 로컬 로직만 확인하려면:

```powershell
npm.cmd run crawl:self-test
```
