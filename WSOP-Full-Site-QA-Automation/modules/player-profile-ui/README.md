# Player Profile UI

WSOP 전체 사이트 자동화의 3단계 후보 모듈입니다.

## 목적

Player Profile 페이지의 주요 UI 영역과 탭 동작을 검증합니다.

## 후보 테스트

- 프로필 페이지가 정상 로드된다.
- 선수명과 summary 영역이 표시된다.
- `ALL`, `Bracelets`, `Rings`, `Final Tables` 계열 탭이 접근 가능하다.
- 탭 전환 후 이벤트 row 목록이 표시된다.
- `Load more` 클릭 후 row 수가 증가한다.
- 이벤트명, 날짜, 장소, 순위, 상금 등 핵심 필드가 비어 있지 않다.
- summary 값보다 표시 row가 부족할 때 경고로 기록한다.
