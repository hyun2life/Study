# 크롤링 기반 검증 자동화

이 자동화는 화면의 요약값만 비교하는 방식이 아니라, 페이지별 데이터를 구조화해서 비교합니다.

## 데이터 모델

```text
Player
  summary
  events[]
    resultPage
  comparisons[]
  defects[]
```

## 비교 기준

- `Title`: 이벤트 순위가 `1`인 행 수
- `Bracelets`: Bracelet 계열 이벤트에서 `1`등한 수
- `Rings`: Circuit/Ring 계열 이벤트에서 `1`등한 수
- `Final Tables`: 이벤트 순위가 `1`부터 `9`까지인 행 수
- `Cashes`: 이벤트 행 수
- `Total Earnings`: 이벤트 상금 합계
- Result page: 이벤트 행과 Result 페이지의 플레이어명, 이벤트명, 순위, 상금 표시 여부

## 기존 버전과 차이

`WSOP-Player-Standings-Check`는 현재 사용 가능한 점검 버전입니다.

`WSOP-Player-Standings-Crawler`는 다음 단계 자동화로, 플레이어 상세와 Result 페이지를 모두 크롤링해서 데이터 모델로 저장하고 비교합니다.
