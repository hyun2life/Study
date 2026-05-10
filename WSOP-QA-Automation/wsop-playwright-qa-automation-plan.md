# WSOP App QA Automation Plan

## 1. Goal

WSOP 앱이 이미 Google Play Store에 배포되어 있다는 전제에서, 저장소 접근 전에도 준비 가능한 1차 QA 자동화 전략을 정리한다.

핵심 방향은 Playwright를 중심에 두되, Playwright가 강한 영역과 네이티브 앱 자동화가 필요한 영역을 분리하는 것이다.

## 2. Starting Assumptions

- 현재 단계에서는 WSOP 내부 저장소, 테스트 계정, QA 환경, 패키지명, 딥링크 스펙에 접근할 수 없다.
- Google Play Store에 배포된 Android 앱을 블랙박스 대상으로 본다.
- 내부에서 이미 Playwright를 사용 중이라는 정보를 우선 반영한다.
- 카지노/게임 앱 특성상 결제, 보상, 칩, 지역 제한, 책임 게임 기능은 별도 안전장치와 테스트 계정이 필요하다.
- 실결제, 실제 베팅, 실제 유저 자산 변경이 발생하는 자동화는 1차 범위에서 제외한다.

## 3. Tool Strategy

### Primary: Playwright

Playwright는 다음 영역의 1차 자동화에 적합하다.

- 모바일 웹 페이지
- 앱 내부 WebView
- 이벤트/프로모션/공지/고객센터 페이지
- 로그인 중 웹 인증 페이지
- 딥링크로 열리는 웹 기반 화면
- API 기반 사전 조건 준비 및 상태 검증
- 스크린샷, trace, 네트워크 기록 수집

### Secondary: Native App Tooling

다음 영역은 Playwright만으로 충분하지 않을 수 있다.

- 순수 네이티브 로비 화면
- 네이티브 게임 런처
- 인앱결제 플로우
- 푸시 알림
- OS 권한 팝업
- 앱 설치/업데이트/백그라운드 복귀
- Canvas/OpenGL 기반 게임 화면의 세부 상호작용

입사 후 앱 구조를 확인한 뒤 Appium, Maestro, Detox, 또는 사내 기존 도구를 보조 축으로 검토한다.

## 4. First-Week Discovery Checklist

입사 후 가장 먼저 확인할 항목이다.

- 앱 패키지명 확인: `adb shell pm list packages | findstr wsop`
- 메인 Activity 확인: `adb shell monkey -p <packageName> 1`
- WebView 사용 여부 확인
- Playwright Android experimental 기능으로 WebView 탐지 가능 여부 확인
- 테스트 계정 종류 확인: guest, email, social, QA seeded account
- QA/stage 환경 접근 방식 확인
- 딥링크 스펙 확인
- 결제 sandbox 또는 purchase mock 여부 확인
- 지역 제한, 연령 확인, 책임 게임 정책 확인
- 테스트 데이터 초기화 방식 확인
- 기존 Playwright 설정, fixture, reporter, CI 연동 방식 확인

## 5. 1st Automation Scope

### Smoke Suite

목표는 매 배포 또는 매일 최소 1회 실행 가능한 짧은 신뢰성 테스트를 만드는 것이다.

| ID | Area | Scenario | Expected Result | Priority | Tool |
|---|---|---|---|---|---|
| SMK-001 | Launch | Google Play 설치 앱 실행 | 앱이 crash 없이 첫 화면에 도달한다 | P0 | Native/ADB + Playwright check |
| SMK-002 | Login | 테스트 계정 로그인 | 로비 또는 홈 화면에 도달한다 | P0 | Playwright if WebView, otherwise native helper |
| SMK-003 | Guest | 게스트 진입 | 제한된 사용자 상태로 진입한다 | P1 | Playwright/WebView |
| SMK-004 | Home | 홈 주요 섹션 로딩 | 로딩 spinner가 사라지고 주요 CTA가 보인다 | P0 | Playwright/WebView |
| SMK-005 | Promo | 프로모션 페이지 진입 | 프로모션 목록 또는 상세가 표시된다 | P1 | Playwright |
| SMK-006 | Notice | 공지/메시지 페이지 진입 | 최신 공지 리스트가 표시된다 | P2 | Playwright |
| SMK-007 | Game Entry | 게임 상세 또는 진입 전 화면 이동 | 게임 시작 전 확인 가능한 화면까지 도달한다 | P0 | Mixed |
| SMK-008 | Wallet | 지갑/칩 페이지 진입 | 잔액 또는 구매 CTA가 표시된다 | P0 | Playwright/Mixed |
| SMK-009 | Purchase | 구매 진입 직전까지 이동 | 실결제 없이 sandbox 또는 mock 단계까지만 확인한다 | P0 | Mixed |
| SMK-010 | Responsible Gaming | 책임 게임/제한 설정 페이지 | 관련 정책 페이지가 접근 가능하다 | P0 | Playwright |
| SMK-011 | Support | 고객센터 진입 | FAQ 또는 문의 페이지가 표시된다 | P2 | Playwright |
| SMK-012 | Logout | 로그아웃 | 세션이 종료되고 로그인 전 상태가 된다 | P1 | Playwright/Mixed |

### Regression Suite

Smoke가 안정화된 뒤 확장한다.

| ID | Area | Scenario | Expected Result | Priority |
|---|---|---|---|---|
| REG-001 | Session | 앱 재실행 후 세션 유지 | 로그인 상태가 정책대로 유지된다 | P1 |
| REG-002 | Deep Link | 프로모션 딥링크 실행 | 대상 화면으로 이동한다 | P1 |
| REG-003 | Network | 느린 네트워크 조건 | timeout 또는 retry UI가 정상 표시된다 | P1 |
| REG-004 | Offline | 오프라인 상태 | 안내 메시지가 표시되고 crash가 없다 | P1 |
| REG-005 | Locale | 언어/지역 설정 | 지원 문구와 제한 정책이 일관된다 | P1 |
| REG-006 | Age Gate | 연령 확인 | 미충족 조건에서 차단된다 | P0 |
| REG-007 | Geofence | 지역 제한 | 제한 지역에서는 적절한 안내가 표시된다 | P0 |
| REG-008 | Bonus | 보상 수령 | 테스트 계정 기준 보상 상태가 정확히 반영된다 | P1 |
| REG-009 | Inbox | 메시지 읽음 상태 | 읽음/안읽음 상태가 유지된다 | P2 |
| REG-010 | Error | 서버 오류 응답 | 사용자 메시지와 복구 동선이 표시된다 | P1 |

## 6. Playwright Test Architecture

저장소 접근 후 다음 구조를 우선 제안한다.

```text
tests/
  smoke/
    app-launch.spec.ts
    login.spec.ts
    home.spec.ts
    promo.spec.ts
    wallet.spec.ts
  regression/
    session.spec.ts
    deeplink.spec.ts
    responsible-gaming.spec.ts
  fixtures/
    app-session.ts
    test-users.ts
    api-client.ts
  pages/
    login.page.ts
    home.page.ts
    promo.page.ts
    wallet.page.ts
    support.page.ts
  utils/
    adb.ts
    deeplink.ts
    screenshots.ts
playwright.config.ts
```

### Naming Rules

- 테스트명은 사용자 행동 중심으로 작성한다.
- `should work` 같은 모호한 이름은 피한다.
- 카지노 앱 특성상 돈, 칩, 보상 상태가 바뀌는 테스트는 이름에 `sandbox`, `mock`, `read-only` 여부를 명시한다.

Example:

```ts
test('logged-in user can open promo detail from home', async ({ page }) => {
  await homePage.open();
  await homePage.openPromoByIndex(0);
  await promoPage.expectDetailVisible();
});
```

## 7. Draft Playwright Config

실제 저장소에서 내부 표준을 확인한 뒤 맞춰야 하지만, 1차 형태는 다음과 같다.

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { outputFolder: 'output/playwright/html-report' }],
    ['junit', { outputFile: 'output/playwright/junit.xml' }],
    ['list'],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.WSOP_BASE_URL,
  },
  projects: [
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 7'],
      },
    },
  ],
});
```

## 8. Black-Box App Flow

Google Play Store 앱 기준의 초도 검증 흐름이다.

1. 테스트 디바이스 준비
2. Google Play 또는 사내 배포 채널로 앱 설치
3. ADB로 앱 실행
4. 앱 내 WebView 또는 외부 Chrome 페이지 탐지
5. Playwright로 접근 가능한 화면부터 자동화
6. 접근 불가한 네이티브 화면은 manual checkpoint 또는 native helper로 분리
7. 실패 시 screenshot, trace, console log, network log, device logcat을 함께 수집

## 9. Risk Controls

카지노 앱 QA에서는 자동화가 실제 자산 또는 정책에 영향을 주지 않도록 경계를 명확히 둔다.

- 실결제 금지
- 실제 베팅 금지
- 실제 유저 계정 사용 금지
- 테스트 계정은 seed/reset 가능해야 한다.
- 보상 수령 테스트는 sandbox 또는 mock 환경에서만 실행한다.
- 지역 제한과 연령 제한 테스트는 정책 담당자와 기대값을 먼저 합의한다.
- 책임 게임 기능은 P0 검증 대상으로 둔다.
- 테스트 로그에 개인정보, 토큰, 결제정보가 남지 않도록 masking한다.

## 10. CI Strategy

1차 CI는 짧고 안정적인 smoke 위주로 구성한다.

```text
pull request:
  - lint
  - unit tests if available
  - Playwright web smoke

nightly:
  - full smoke
  - selected regression
  - trace/screenshot retention

release candidate:
  - smoke
  - payment sandbox checks
  - responsible gaming checks
  - region/age gate checks
```

## 11. Entry Criteria

자동화를 시작하기 위해 필요한 정보다.

- Android package name
- 테스트 계정
- QA/stage endpoint
- Playwright 사내 표준 설정
- WebView debug 가능 여부
- 딥링크 목록
- 결제 sandbox 정책
- 테스트 데이터 reset 방법
- CI 실행 환경

## 12. Exit Criteria

1차 자동화 완료 기준이다.

- P0 smoke 5개 이상 자동 실행 가능
- 실패 시 screenshot/trace가 남는다.
- 로그인 또는 세션 준비 방식이 fixture로 분리되어 있다.
- 실결제/실베팅이 발생하지 않는 안전장치가 있다.
- CI 또는 로컬 한 줄 명령으로 실행 가능하다.
- 수동 QA가 매번 반복하던 진입/로그인/프로모션/지갑 확인 시간이 줄어든다.

## 13. Recommended First Deliverables

입사 후 첫 결과물은 다음 순서가 좋다.

1. `WSOP QA Automation Discovery` 문서
2. Playwright smoke suite 5개
3. 테스트 계정 fixture
4. failure artifact 수집 체계
5. CI nightly smoke job
6. 네이티브 영역 자동화 가능성 평가표

## 14. Interview/Onboarding Talking Points

면접 또는 초기 온보딩에서 다음처럼 설명할 수 있다.

```text
Playwright를 이미 쓰고 있다면, 앱 전체를 한 번에 자동화하기보다 WebView, 모바일 웹, API 검증처럼 Playwright가 안정적인 영역부터 smoke suite로 묶겠습니다.
Google Play에 배포된 앱은 블랙박스 기준으로 launch, login, promo, wallet, responsible gaming 같은 P0 경로를 먼저 검증하고,
순수 네이티브 구간은 Playwright 접근 가능성을 확인한 뒤 Appium이나 Maestro 같은 보조 도구 필요 여부를 판단하겠습니다.
특히 카지노 앱에서는 실결제와 실제 자산 변경을 막는 테스트 안전장치를 자동화 설계의 선행 조건으로 두겠습니다.
```

## 15. References

- Playwright Android API: https://playwright.dev/docs/api/class-android
- Playwright Android WebView API: https://playwright.dev/docs/api/class-androidwebview
- Playwright mobile emulation: https://playwright.dev/docs/emulation
- Playwright API testing: https://playwright.dev/docs/api-testing
