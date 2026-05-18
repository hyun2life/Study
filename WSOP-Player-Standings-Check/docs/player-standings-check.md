# WSOP Player Standings Check

이 폴더는 WSOP 웹 플레이어 프로필 데이터 정합성만 확인하는 단독 도구입니다.

기존 `WSOP-QA-Automation`은 앱 또는 전체 Playwright QA 자동화 파이프라인 용도이고, 이 도구는 `https://wsop-stage.ggnweb.com/players`의 Players Standings 화면과 플레이어 상세 화면 데이터만 검수합니다.

## 실행 위치

아래 폴더에서 실행합니다.

```text
Study\WSOP-Player-Standings-Check
```

가장 쉬운 방법은 이 파일을 더블클릭하는 것입니다.

```text
RUN_WSOP_PLAYER_CHECK.bat
```

라이브 `wsop.com` 기준으로 실행하려면 이 파일을 더블클릭합니다.

```text
RUN_WSOP_PLAYER_CHECK_LIVE.bat
```

## 실행 흐름

1. Chrome 브라우저가 열립니다.
2. 스테이징 로그인이 필요하면 직접 로그인합니다.
3. 로그인 후 플레이어 목록에서 플레이어를 수집합니다.
4. 각 플레이어 상세 페이지의 상단 요약 데이터와 하단 이벤트 데이터를 비교합니다.
5. 일부 이벤트의 `Result` 링크로 이동해서 결과 페이지 데이터 표시도 확인합니다.
6. JSON, CSV, HTML 리포트를 생성합니다.

기본 실행은 플레이어 10명, 플레이어당 Result 링크 3개를 확인합니다.

## 명령어 실행

배치 파일 대신 직접 실행하려면 아래 명령어를 사용합니다.

```powershell
cd C:\Users\USER1\Desktop\Study\WSOP-Player-Standings-Check
powershell -ExecutionPolicy Bypass -File automation\run_player_standings_check.ps1 -Headed -AuthWaitMs 300000 -Limit 10 -ResultLimit 3
```

라이브 URL로 실행하려면 아래처럼 `-PlayersUrl`만 바꿉니다.

```powershell
powershell -ExecutionPolicy Bypass -File automation\run_player_standings_check.ps1 `
  -PlayersUrl "https://www.wsop.com/player-standings/" `
  -Headed `
  -Limit 10 `
  -ResultLimit 3 `
  -Out "automation\output\wsop-player-standings-live-report.json"
```

특정 플레이어 URL만 확인할 수도 있습니다.

```powershell
powershell -ExecutionPolicy Bypass -File automation\run_player_standings_check.ps1 `
  -Headed `
  -AuthWaitMs 300000 `
  -PlayerUrl "https://wsop-stage.ggnweb.com/players/example"
```

## 로컬 자체 검증

스테이징 접속 없이 계산 로직과 리포트 생성 로직만 확인할 수 있습니다.

```powershell
npm run check:players:self-test
npm run report:players:self-test
```

## 산출물

실행 후 아래 폴더에 결과가 생성됩니다.

```text
automation\output
```

주요 파일은 다음과 같습니다.

- `wsop-player-standings-report.html`: 사람이 확인하기 좋은 HTML 리포트
- `wsop-player-standings-report.csv`: 플레이어별 요약 CSV
- `wsop-player-standings-report.json`: 전체 원본 검사 결과
- `wsop-player-standings-summary.json`: 전체 요약 JSON
- `wsop-player-standings-defects.csv`: 불일치 및 경고 항목만 모은 결함 후보 CSV

## 정합성 기준

- `Title`: 하단 이벤트 중 플레이어 순위가 `1`인 이벤트 수
- `Bracelets`: WSOP Bracelet 계열 이벤트에서 `1`등한 수
- `Rings`: Circuit/Ring 계열 이벤트에서 `1`등한 수
- `Final Tables`: 하단 이벤트 중 순위가 `1`부터 `9`까지인 이벤트 수
- `Cashes`: 플레이어가 상금을 받은 전체 이벤트 수, 즉 하단 이벤트 행 수
- `Total Earnings`: 하단 이벤트 상금 합계
- Badge count: 프로필 하단 Bracelet/Ring 뱃지 수가 상단 Bracelet/Ring 수와 일치하는지 확인
- Result page: 이벤트 `Result` 링크 진입 후 플레이어, 이벤트, 순위, 상금 정보가 표시되는지 확인

## 리포트 보는 법

HTML 리포트에서 먼저 `Defect Candidates` 섹션을 확인합니다.

- `Data mismatch`: 상단 요약값과 하단 계산값이 다른 항목
- `Result page mismatch`: Result 페이지 진입 후 기대 데이터가 보이지 않는 항목
- `Warning`: 이벤트 행, 뱃지, Result 링크 등을 자동으로 충분히 감지하지 못한 항목

그 다음 `Player Details`에서 플레이어별 상세 비교를 확인합니다.

## 주의사항

스테이징 로그인이 필요한 경우 첫 실행 때 열린 Chrome에서 직접 로그인하면 됩니다. 로그인 세션은 아래 폴더에 저장되어 이후 실행 때 재사용됩니다.

```text
automation\.auth\wsop-player-check
```

사이트 DOM 구조나 문구가 바뀌면 추출 로직 보정이 필요할 수 있습니다. 보정 대상 파일은 다음입니다.

```text
automation\check_players_standings.mjs
```
