# WSOP Full Site QA Automation

WSOP 전체 사이트를 단계별로 자동화하기 위한 상위 작업 공간입니다.

이 공간의 목표는 특정 크롤러 하나를 운영하는 것이 아니라, WSOP 사이트의 핵심 사용자 흐름과 데이터 정합성을 독립 모듈로 나누어 자동화하고, 최종적으로 하나의 QA 리포트로 통합하는 것입니다.

## 기본 방향

- 전체 목표는 `Full Site QA Automation`이다.
- 각 자동화는 `modules/` 아래의 독립 모듈로 관리한다.
- 현재 진행 중인 1단계는 `player-standings-data-integrity` 모듈이다.
- 기존 크롤러 프로젝트는 1단계 모듈의 실제 구현으로 사용한다.
- 새 기능은 처음부터 풀 사이트 자동화 구조 안에 추가한다.

## 목표 폴더 구조

```text
WSOP-Full-Site-QA-Automation/
  README.md
  modules/
    player-standings-data-integrity/
      README.md
    standings-ui-smoke/
      README.md
    player-profile-ui/
      README.md
    result-detail-integrity/
      README.md
    link-navigation-health/
      README.md
    search-filter-sort/
      README.md
    visual-regression/
      README.md
    performance-stability-smoke/
      README.md
  reports/
    README.md
```

## 단계별 모듈

| 단계 | 모듈 | 목적 | 상태 |
| --- | --- | --- | --- |
| 1 | `player-standings-data-integrity` | Player Standings, Player Profile, Result 상세 데이터 정합성 검증 | 진행 중 |
| 2 | `standings-ui-smoke` | standings 목록, 카테고리, 선수 링크 이동 검증 | 예정 |
| 3 | `player-profile-ui` | 프로필 요약, 탭, Load more, 핵심 필드 노출 검증 | 예정 |
| 4 | `result-detail-integrity` | Result 상세 페이지 pagination과 최종 순위표 검증 확장 | 예정 |
| 5 | `link-navigation-health` | 주요 링크, redirect, 404, 빈 페이지, asset 상태 검증 | 예정 |
| 6 | `search-filter-sort` | 검색, 필터, 정렬, no-result 상태 검증 | 예정 |
| 7 | `visual-regression` | 주요 페이지 레이아웃 깨짐과 핵심 영역 누락 탐지 | 예정 |
| 8 | `performance-stability-smoke` | 로딩 시간, timeout, flaky 항목 추적 | 예정 |

## 현재 1단계 구현

현재 1단계 구현은 기존 폴더에 있습니다.

```text
../WSOP-Player-Standings-Crawler-Improved/
```

이 구현은 `player-standings-data-integrity` 모듈로 취급합니다.

실행 진입점:

```text
../WSOP-Player-Standings-Crawler-Improved/RUN_WSOP_PLAYER_CRAWLER_LIVE.bat
../WSOP-Player-Standings-Crawler-Improved/RUN_WSOP_PLAYER_CRAWLER.bat
```

결과 산출물:

```text
../WSOP-Player-Standings-Crawler-Improved/automation/output/*-data.json
../WSOP-Player-Standings-Crawler-Improved/automation/output/*-report.html
../WSOP-Player-Standings-Crawler-Improved/automation/output/*-report-ko.html
../WSOP-Player-Standings-Crawler-Improved/automation/output/*-defects.csv
```

## 운영 원칙

- 라이브 사이트에서는 읽기 전용 검증만 수행한다.
- 사이트 부하가 큰 검증은 limit, concurrency, page limit으로 제어한다.
- 데이터 불일치, 페이지 접근 실패, 크롤링 실패를 리포트에서 분리한다.
- 각 모듈은 빠른 smoke preset과 정밀 검증 preset을 분리한다.
- 모든 모듈은 최종적으로 공통 리포트 형식으로 합쳐질 수 있어야 한다.

## 다음 작업

1. 1단계 크롤러 리포트를 `player-standings-data-integrity` 모듈 기준으로 정리한다.
2. 2단계 `standings-ui-smoke`의 테스트 케이스를 실제 실행 단위로 나눈다.
3. 공통 리포트 데이터 모델을 정의한다.
4. 기존 크롤러 구현을 새 모듈 폴더로 물리 이동할지 결정한다.
