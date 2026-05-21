# Performance Stability Smoke

WSOP 전체 사이트 자동화의 8단계 후보 모듈입니다.

## 목적

기능 성공 여부와 별개로 반복 실행 안정성과 기본 성능을 추적합니다.

## 후보 테스트

- 주요 페이지 initial load time 기록
- Player Profile 평균 로드 시간 기록
- Result Detail 평균 로드 시간 기록
- timeout 발생 URL 수집
- 동일 설정 반복 실행 시 flaky 항목 추적
- 네트워크 실패와 사이트 데이터 불일치를 리포트에서 분리
