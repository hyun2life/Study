# Result Detail Integrity

WSOP 전체 사이트 자동화의 4단계 후보 모듈입니다.

## 목적

Result 상세 페이지의 최종 순위표와 pagination을 깊게 검증합니다.

## 후보 테스트

- Result 상세 페이지가 정상 로드된다.
- 최종 결과 테이블이 표시된다.
- pagination 또는 다음 페이지 컨트롤이 정상 동작한다.
- 예상 rank 주변 페이지부터 검색해 대상 player row를 찾는다.
- 대상 player row의 이름, 순위, 상금이 event row와 일치한다.
- 비활성 Result 컨트롤 처리 정책이 설정대로 동작한다.
- Result 상세에서 Player Profile로 되돌아가는 링크가 유효하다.
