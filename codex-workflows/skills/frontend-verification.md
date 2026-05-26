# Skill: 프론트엔드 검증

Codex 작업이 HTML, CSS, JavaScript UI 동작, navigation active 상태, side panel, layout variant를 바꿀 때 사용합니다.

## 사용 시점

- nav active 상태, section/process 스타일, layout variant를 수정할 때
- 여러 HTML/layout variant 중 하나를 실제 버전으로 승격할 때
- `ImagiPark/sidepanel/sidepanel.html` 같은 extension sidepanel UI를 확인할 때
- 프론트엔드 수정 후 local browser 또는 Chrome 검증이 필요할 때

## 작업 흐름

1. 변경된 UI 파일을 확인하고 가장 작은 사용자 흐름을 식별합니다.
2. 새 CSS나 동작을 추가하기 전에 기존 convention을 먼저 확인합니다.
3. 실행 방식, 산출물, 구조가 바뀌면 README 또는 가까운 문서를 갱신합니다.
4. 가장 좁고 유용한 static/browser 검증을 실행합니다.
5. 단순 HTML은 file URL 또는 local dev server 중 상황에 맞는 방식을 사용합니다.
6. 실행한 검증 명령과 화면/DOM에서 확인한 결과를 한국어로 요약합니다.

## 검증 체크리스트

- desktop/mobile에서 버튼, 카드, compact panel 안의 텍스트가 넘치지 않습니다.
- active, hover, disabled, loading 상태가 layout shift 없이 안정적입니다.
- UI 요소가 서로 겹치지 않습니다.
- 참조한 asset이 정상 렌더링됩니다.
- browser output 또는 DOM에 기대한 key string이 있습니다.
- generated output과 test artifact는 필요 시 `.gitignore`에 포함됩니다.

## 응답 형식

기본적으로 한국어로 답합니다. 아래 내용을 포함합니다.

- 변경한 파일
- 수행한 검증
- 남은 위험 또는 생략한 체크
