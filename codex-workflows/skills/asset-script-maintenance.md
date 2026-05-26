# Skill: Asset Script 유지보수

생성 이미지, sticker PNG, icon, 기타 반복 생성 asset을 만드는 자동화 스크립트를 생성하거나 수정할 때 사용합니다.

## 사용 시점

- icon 생성 스크립트를 만들거나 수정할 때
- sticker PNG 또는 image batch를 처리할 때
- output folder, filename, asset dimension 규칙을 바꿀 때
- 생성 asset을 commit 전에 정리할 때

## 작업 흐름

1. source asset, generated output, script 위치를 먼저 식별합니다.
2. script input/output을 명확하게 유지합니다.
3. 사용자가 만든 source file을 덮어쓰지 않습니다.
4. generated output folder는 필요하면 `.gitignore`에 추가하거나 갱신합니다.
5. README에 목적, 실행 명령, output path, 유지보수 포인트를 기록합니다.
6. output이 큰 경우 가능하면 full batch 대신 작은 sample을 먼저 실행합니다.

## 문서 체크리스트

- 프로젝트 목적
- 주요 script command
- input folder와 output folder
- 필요한 package 또는 runtime
- 의도적인 skip 기준 또는 naming rule
- 생성 이미지 수동 검토 포인트

## 응답 형식

기본적으로 한국어로 답합니다. 아래 내용을 포함합니다.

- 변경하거나 추가한 script
- 실행한 sample command
- output 위치
- 의도적으로 untracked로 둔 파일
