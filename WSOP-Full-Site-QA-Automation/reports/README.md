# Reports

전체 WSOP QA 자동화의 통합 리포트 산출물을 두기 위한 폴더입니다.

초기에는 각 모듈이 자체 리포트를 생성하고, 이후 아래 형식으로 통합합니다.

```text
reports/
  YYYYMMDD-HHmmss/
    summary.json
    report-ko.html
    report.html
    defects.csv
    artifacts/
```

## 통합 리포트 후보 항목

- 전체 pass/fail/warn/interrupted 요약
- 모듈별 결과 카드
- 결함 후보 우선순위
- 실패 URL과 재현 정보
- 스크린샷, trace, JSON, CSV 링크
- 전회차 대비 증감
- 실행 설정과 환경 정보
