# WSOP Web Automation

`wsop.com` 공개 웹사이트의 1차 smoke test 자동화 프로젝트입니다.

목표는 깊은 기능 검증이 아니라, 배포 후 주요 공개 페이지가 정상적으로 열리는지, 핵심 영역이 보이는지, 상단 네비게이션이 노출/이동 가능한지, 치명적인 콘솔 에러와 깨진 내부 링크 샘플이 있는지 빠르게 확인하는 것입니다.

## 주요 기능

- Playwright 기반 공개 페이지 smoke test
- Chromium desktop 및 Pixel 7 mobile 프로젝트 지원
- 공개 페이지 HTTP status 및 핵심 문구 확인
- 상단 네비게이션 라벨/목적지 도달성 확인
- 콘솔 에러 수집 및 known noisy third-party/SSE 에러 제외
- wsop.com 내부 링크 샘플 상태 확인
- Playwright 기본 HTML Report 생성
- 별도 한글/영문 최종 smoke 리포트 생성
- 실패 시 screenshot, trace, video 저장

## 폴더 구조

```text
wsop-web-automation/
  automation/
    output/                         # custom smoke report output
  data/
    public-pages.ts                 # smoke 대상 공개 페이지 목록
  scripts/
    wsop-smoke-html-reporter.cjs    # 한글/영문 최종 리포트 reporter
  tests/
    smoke/
      public-pages.spec.ts
      navigation.spec.ts
      console-error.spec.ts
      links.spec.ts
  playwright.config.ts
  package.json
  run-smoke.bat
  run-smoke-headed.bat
  run-smoke-ui.bat
```

## 설치

처음 한 번만 실행합니다.

```bat
npm install
npx playwright install chromium
```

PowerShell 실행 정책 때문에 `npm`이 막히면 Windows에서는 아래처럼 `npm.cmd`를 사용하세요.

```bat
npm.cmd install
npx.cmd playwright install chromium
```

## 실행 방법

### Windows BAT

기본 desktop smoke:

```bat
run-smoke.bat
```

브라우저를 실제로 보면서 실행:

```bat
run-smoke-headed.bat
```

Playwright UI 모드:

```bat
run-smoke-ui.bat
```

### npm scripts

```bat
npm run test:smoke
npm run test:smoke:headed
npm run test:smoke:ui
npm run test:smoke:mobile
npm run test:smoke:all
```

## 리포트

Playwright 기본 리포트:

```bat
npm run report
```

custom 한글 최종 리포트:

```bat
npm run report:smoke:ko
```

custom 영문 최종 리포트:

```bat
npm run report:smoke:en
```

생성 위치:

```text
automation/output/wsop-public-smoke-*-report-ko.html
automation/output/wsop-public-smoke-*-report.html
automation/output/wsop-public-smoke-latest-report-ko.html
automation/output/wsop-public-smoke-latest-report.html
playwright-report/index.html
test-results/
```

한글 리포트가 기본 검토 대상입니다. 영문 리포트는 동일 데이터를 영어 UI로 보여줍니다.

## 대상 공개 페이지

대상 목록은 [data/public-pages.ts](./data/public-pages.ts)에 있습니다.

- Home: `/`
- Tournament Schedule: `/schedule/`
- Player Standings: `/player-standings/`
- Player Search: `/player-search/`
- Hall of Fame: `/hall-of-fame/`
- News: `/news/`

문구 검증은 brittle하지 않도록 최소 핵심 문구만 사용합니다. 실제 wsop.com 문구가 바뀌면 `expectedTexts`를 먼저 조정하세요.

## 설정

기본 대상 URL:

```text
https://www.wsop.com
```

다른 환경을 테스트하려면 `BASE_URL` 환경변수를 사용합니다.

```bat
set BASE_URL=https://www.wsop.com
npm run test:smoke
```

## 유지보수 포인트

- wsop.com 상단 메뉴는 현재 desktop에서 `header nav li` 라벨 중심으로 렌더링됩니다.
- mobile에서는 햄버거 메뉴와 slide-out nav 구조 때문에 hover/click이 불안정할 수 있어 라벨 존재와 목적지 도달성을 분리해서 확인합니다.
- `Play Online`은 현재 안정적인 wsop.com 내부 anchor가 노출되지 않아 label-only smoke로 처리합니다.
- Schedule/Standings 등 일부 페이지에서 `[SSE] EventSource failed for maintenance` 콘솔 에러가 발생할 수 있습니다. 페이지 핵심 로딩과 무관한 noisy error로 ignore 처리했습니다.
- 링크 체크는 사이트 부하 방지를 위해 페이지당 최대 30개만 검사합니다.
- 일부 보안/봇 차단 정책으로 내부 링크 request가 `403` 또는 `405`를 반환할 수 있어 smoke 기준에서는 reachable-but-blocked로 허용합니다.
- 더 엄격한 릴리즈 게이트가 필요하면 `tests/smoke/links.spec.ts`의 허용 status code 정책을 조정하세요.

## 산출물 제외

아래 생성물은 `.gitignore` 대상입니다.

```text
node_modules/
test-results/
playwright-report/
blob-report/
automation/output/
```

## 검증 범위에서 제외한 것

이번 자동화는 1차 smoke test입니다. 아래 항목은 범위에 포함하지 않습니다.

- 토너먼트 필터 정확성
- 플레이어 데이터 정합성
- 뉴스 상세 데이터 정합성
- 로그인/결제/온라인 플레이 기능 검증
- 모든 내부 링크 전수 검사
