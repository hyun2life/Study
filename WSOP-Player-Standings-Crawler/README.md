# WSOP Player Standings Crawler

WSOP 웹 플레이어 데이터를 크롤링해서 구조화 데이터로 저장하고, 조건에 맞게 비교하는 별도 자동화입니다.

현재 `WSOP-Player-Standings-Check`는 기존 버전으로 그대로 유지합니다. 이 폴더는 다음 단계인 크롤링 기반 검증용입니다.

## 실행

아래 파일을 더블클릭합니다.

```text
RUN_WSOP_PLAYER_CRAWLER.bat
```

## 동작 방식

1. Players 목록 페이지에서 플레이어 URL을 수집합니다.
2. 각 플레이어 상세 페이지에서 상단 요약 데이터와 하단 이벤트 데이터를 크롤링합니다.
3. 이벤트 행의 `Result` 링크 또는 버튼을 따라 결과 페이지로 이동합니다.
4. Result 페이지에서 플레이어명, 이벤트명, 순위, 상금 표시 여부를 확인합니다.
5. 수집한 구조화 데이터끼리 비교해서 결함 후보를 만듭니다.
6. JSON, CSV, HTML 리포트를 생성합니다.

## 산출물

```text
automation\output\wsop-player-crawler-data.json
automation\output\wsop-player-crawler-report.html
automation\output\wsop-player-crawler-defects.csv
```

## 자체 검증

```powershell
npm run crawl:self-test
```
