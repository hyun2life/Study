# WSOP Player Standings Check

WSOP 웹 플레이어 프로필 데이터 정합성을 확인하는 단독 점검 도구입니다.

기존 `WSOP-QA-Automation`은 앱 또는 전체 Playwright QA 자동화 파이프라인 용도이고, 이 폴더는 `https://wsop-stage.ggnweb.com/players`의 플레이어 스탠딩/상세 페이지 데이터만 확인합니다.

## 빠른 실행

아래 파일을 더블클릭합니다.

```text
RUN_WSOP_PLAYER_CHECK.bat
```

실행하면 Chrome이 열립니다. 스테이징 로그인이 필요하면 직접 로그인하면 되고, 로그인 후 자동으로 플레이어 데이터를 검사합니다.

## 검사 내용

- 플레이어 목록에서 플레이어 상세 페이지 진입
- 상단 요약 데이터와 하단 이벤트 데이터 비교
- `Title`, `Bracelets`, `Rings`, `Final Tables`, `Cashes`, `Total Earnings` 정합성 확인
- 프로필 하단 Bracelet/Ring 뱃지 수 확인
- 이벤트 `Result` 링크 진입 후 결과 페이지 데이터 표시 확인
- JSON, CSV, HTML 리포트 생성

## 결과 위치

검사 결과는 아래 폴더에 생성됩니다.

```text
automation\output
```

주요 리포트:

- `wsop-player-standings-report.html`
- `wsop-player-standings-report.csv`
- `wsop-player-standings-report.json`
- `wsop-player-standings-defects.csv`

## 직접 실행

배치 파일 대신 명령어로 실행하려면:

```powershell
cd C:\Users\USER1\Desktop\Study\WSOP-Player-Standings-Check
powershell -ExecutionPolicy Bypass -File automation\run_player_standings_check.ps1 -Headed -AuthWaitMs 300000 -Limit 10 -ResultLimit 3
```

## 문서

자세한 사용법과 정합성 기준은 아래 문서를 확인합니다.

```text
docs\player-standings-check.md
```
