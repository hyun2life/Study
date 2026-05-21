# Player Standings Data Integrity

WSOP 전체 사이트 자동화의 1단계 모듈입니다.

이 모듈은 Player Standings에서 시작해 Player Profile과 Result 상세 페이지까지 데이터를 수집하고, 서로 다른 화면의 값이 일치하는지 검증합니다.

## 현재 구현 위치

현재 실제 구현은 기존 크롤러 폴더에 있습니다.

```text
../../../WSOP-Player-Standings-Crawler-Improved/
```

이 폴더의 크롤러를 이 모듈의 구현체로 사용합니다.

## 검증 범위

- standings 카테고리별 선수 목록 수집
- 선수 프로필 페이지 진입
- 프로필 상단 요약값과 ALL 탭 이벤트 row 비교
- `Title`, `Bracelets`, `Rings`, `Final Tables`, `Cashes`, `Total Earnings` 계산
- 이벤트 row의 Result 상세 페이지 진입
- Result 상세 최종 순위표에서 선수명, 순위, 상금 일치 여부 확인
- 비활성 Result 컨트롤을 `skip`, `fail`, `check` 정책으로 처리
- JSON, CSV, 한글 HTML 리포트 생성

## 실행

라이브 사이트 검증:

```text
../../../WSOP-Player-Standings-Crawler-Improved/RUN_WSOP_PLAYER_CRAWLER_LIVE.bat
```

스테이지 검증:

```text
../../../WSOP-Player-Standings-Crawler-Improved/RUN_WSOP_PLAYER_CRAWLER.bat
```

로컬 self-test:

```powershell
cd ../../../WSOP-Player-Standings-Crawler-Improved
npm.cmd run crawl:self-test
```

## 완료 기준

- 설정된 선수 범위가 안정적으로 수집된다.
- 실패 항목이 한글 HTML 리포트에서 바로 확인된다.
- 결함 후보가 CSV로 남는다.
- 중단 시에도 완료된 선수 기준의 부분 리포트가 남는다.
- 브라우저 없는 self-test로 핵심 로직을 검증할 수 있다.

## 다음 확장

- 결함 분류를 데이터 불일치, 접근 실패, 파싱 실패, 정책상 skip으로 분리한다.
- 통합 리포트에 맞춘 JSON summary를 별도 산출물로 만든다.
- 현재 구현 폴더를 이 모듈 아래로 물리 이동할지 결정한다.
