# Live Page Feedback Tool (Chrome Extension Builder)

웹페이지 요소의 정밀한 시각적/구조적 정보(CSS Selector, 뷰포트, 마우스 좌표, 바운딩 박스 등)를 수집하여 AI 에이전트에게 프롬프트용 피드백 마크다운을 손쉽게 복사 및 전송할 수 있는 Chrome Extension(크롬 확장 프로그램) 빌드 및 배포 패키지 빌더입니다.

---

## 📂 폴더 구조 및 주요 파일

```text
live-page-feedback-tool/
├── extension/                  # 크롬 확장 프로그램 등록 대상 폴더 (배포본)
│   ├── manifest.json           # 확장 프로그램 설정 명세 (Manifest V3)
│   ├── popup.html              # 확장 프로그램 툴바 아이콘 클릭 시 뜨는 팝업 UI
│   ├── popup.js                # 팝업 UI 제어 및 content.js 주입 스크립트
│   ├── content.js              # [Vite 빌드 생성물] React + Agentation 번들 본체
│   ├── icon16.png~icon128.png  # 규격별 확장 프로그램 로고 아이콘
│   ├── agentation-demo-check.png # 팝업 창 하단 노출용 구동 예시 스크린샷
│   ├── run-feedback-chrome.bat # [팀원용] 원클릭 확장 자동 탑재 크롬 실행기
│   └── README.md               # 확장 프로그램 배포 전용 가이드
├── src/
│   └── content.tsx             # [진입점] React 마운트 및 크롬 메시지 수신부
├── vite.config.ts              # [Vite 설정] outDir를 'extension'으로 컴파일하도록 단일화
├── build-extension.bat         # 개발자용 Vite 수동 컴파일 배치 스크립트
├── pack-extension.bat          # 선컴파일 및 live-page-feedback-dist.zip 자동 패키징 런처
├── live-page-feedback-dist.zip # 최종 팀원 배포용 압축팩
└── README.md                   # 프로젝트 전체 매뉴얼 (본 문서)
```

---

## 🛠️ 개발자용 빌드 및 패키징 방법

1. 소스코드가 수정된 경우 빌드를 통해 `extension/content.js`를 컴파일합니다.
   ```bat
   build-extension.bat
   ```
2. 빌드 결과물과 로고, 팝업 리소스들을 최종 배포용 zip 파일로 원클릭 패키징합니다. (빌드가 누락된 경우 자동으로 빌드 후 압축을 수행합니다.)
   ```bat
   pack-extension.bat
   ```
   - 실행 완료 시 프로젝트 루트에 **`live-page-feedback-dist.zip`** 배포용 패키지가 갱신되어 생성됩니다.

---

## 🚀 팀원용 원클릭 실행 방법 (가장 편리함)

팀원들은 복잡한 수동 등록 없이 아래 스텝만으로 손쉽게 구동할 수 있습니다.

1. 배포받은 **`live-page-feedback-dist.zip`** 압축을 해제합니다.
2. 해제된 폴더 안에 들어 있는 **`run-feedback-chrome.bat`** 파일을 더블클릭합니다.
3. 나타나는 커맨드 창에 피드백을 남길 **대상 웹페이지 주소**를 입력하고 엔터를 누릅니다.
   - 예: `https://naver.com` 혹은 로컬 개발 서버 주소 (`http://localhost:3000` 등)
4. 자동으로 해당 피드백 툴 확장 프로그램이 완벽히 탑재된 크롬 브라우저가 기동됩니다.
5. 크롬 우측 상단의 **퍼즐(🧩) 버튼**을 클릭하여 **Live Page Feedback** 옆의 **고정 핀(📌)**을 꽂아 공식 보라색 로고를 활성화한 뒤 사용하면 됩니다.

---

## 📌 주의사항
- **크롬 보안 제한**: 크롬 브라우저의 기본 설정창(`chrome://`), 크롬 웹스토어 등의 특수 도메인 페이지에서는 브라우저 보안 규정으로 인해 외부 스크립트 주입이 차단되므로 작동하지 않습니다. 일반 웹사이트 도메인이나 로컬 호스트(`localhost`) 상에서 실행해 주시기 바랍니다.
