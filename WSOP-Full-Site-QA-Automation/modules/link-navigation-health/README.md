# Link Navigation Health

WSOP 전체 사이트 자동화의 5단계 후보 모듈입니다.

## 목적

주요 링크와 페이지 접근 상태를 점검합니다.

## 후보 테스트

- 주요 내비게이션 링크가 200 계열 또는 기대 redirect로 응답한다.
- broken link, 404, 500, redirect loop를 수집한다.
- 외부 링크는 별도 그룹으로 분리해 timeout 기준을 다르게 둔다.
- 이미지, CSS, JS 같은 핵심 asset 실패를 감지한다.
- Player Profile, Event, Result URL 샘플이 직접 접근 가능하다.
