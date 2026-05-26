# Codex Workflows

## 프로젝트 목적

이 폴더는 이 workspace에서 자주 반복되는 Codex 작업을 작고 재사용 가능한 형태로 정리합니다. 최근 패턴은 프론트엔드 수정 후 브라우저 확인, GitHub 배포 전 점검, 이미지/아이콘 생성 스크립트 관리, README 갱신 같은 실무 흐름입니다.

## 주요 기능

- 프론트엔드 변경 검증과 문서 갱신용 skill 프롬프트
- 이미지/아이콘/스티커 생성 스크립트 관리용 skill 프롬프트
- 좁은 범위의 UI 회귀 조사용 custom subagent 프롬프트
- commit/push 전 릴리스 준비 상태 점검용 custom subagent 프롬프트

## 폴더 구조

```text
codex-workflows/
  README.md
  skills/
    frontend-verification.md
    asset-script-maintenance.md
  subagents/
    ui-regression-investigator.md
    release-readiness-reviewer.md
```

## 설치 방법

별도 패키지 설치는 필요 없습니다. 전역 Codex skill 또는 subagent로 쓰고 싶다면 필요한 파일 내용을 원하는 설정 위치로 옮기면 됩니다.

## 실행 방법

Codex에게 작업을 요청할 때 관련 파일을 참고하라고 지시하거나, 내용을 Codex skill/subagent 설정으로 옮겨 사용합니다.

## 주요 명령

이 폴더 자체에는 npm, bat, 스크립트 실행 명령이 없습니다.

## 산출물 위치

이 폴더는 리포트, 로그, 다운로드, 빌드 결과물을 생성하지 않습니다.

## 환경변수 및 설정값

필요한 환경변수는 없습니다.

## 유지보수 주의사항

- 각 workflow는 작고 구체적으로 유지합니다.
- 같은 수작업이 여러 번 반복될 때만 새 workflow를 추가합니다.
- workflow 파일을 추가하거나 삭제하면 이 README도 함께 갱신합니다.

## 알려진 제한사항

- 이 파일들은 실제 Codex 세션 전체 자동 분석이 아니라, 현재 workspace에서 보이는 최근 작업 패턴을 기준으로 만들었습니다.
- 생성 시점에 shell 실행이 `CryptUnprotectData failed: 2148073483` 오류로 막혀 로컬 세션 데이터베이스는 파싱하지 못했습니다.
