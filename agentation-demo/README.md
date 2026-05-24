# Agentation Demo

React 앱이 없는 상태에서 `agentation`을 바로 써보기 위한 Vite 데모입니다.
로컬 HTML 파일을 불러와 그 화면 위에 Agentation 피드백을 남기는 리뷰 모드도 포함합니다.

## 실행

```bat
npm install
npm run dev
```

브라우저에서 `http://127.0.0.1:5173`을 열고 우측 하단 Agentation 툴바를 사용하세요.

## HTML 파일 리뷰

1. `http://127.0.0.1:5173` 접속
2. 상단 입력칸에 검토할 `.html` 파일의 전체 경로 입력
3. `HTML 열기` 클릭
4. 우측 하단 Agentation 버튼으로 HTML 요소 선택
5. 피드백 작성 후 `Copy feedback` 클릭
6. 상단의 `마지막 복사된 프롬프트 보기` 또는 클립보드 내용을 Codex에 전달

예시:

```text
C:\Users\USER1\Desktop\Study\wsop-web-automation\automation\output\wsop-public-smoke-latest-report-ko.html
```

보안상 현재 workspace인 `C:\Users\USER1\Desktop\Study` 아래의 `.html`/`.htm` 파일만 열 수 있게 제한했습니다.

## 실제 앱에 옮길 때

```tsx
import { Agentation } from 'agentation';

function App() {
  return (
    <>
      <YourApp />
      <Agentation />
    </>
  );
}
```
