# Discord 일간/주간 리포트 운영 가이드

이 문서는 Discord 채널 메시지를 수집하고, OpenAI로 요약 분석한 뒤, HTML 리포트와 이메일 발송까지 자동화하는 프로젝트의 범용 운영 가이드입니다.
특정 게임이나 서비스 전용 문서가 아니라, 다른 프로젝트에도 그대로 복제하여 사용할 수 있도록 작성되었습니다.

## 개요

이 프로젝트는 다음 작업을 자동으로 수행합니다.

- 지정한 Discord 채널의 메시지 수집
- 일간 리포트 생성
- 주간 리포트 생성
- OpenAI 기반 요약 및 인사이트 분석
- HTML 리포트 저장
- 이메일 발송
- 중복 메시지 처리 및 중복 메일 발송 방지

## 폴더 구조

```text
discord_report/
|-- discord_report.py
|-- config.json
|-- config.example.json
|-- run_report.bat
|-- run_report_manual.bat
|-- state.json
|-- reports/
|   |-- daily/
|   `-- weekly/
`-- logs/
```

## 주요 파일 설명

- `discord_report.py`: 메인 실행 스크립트
- `config.json`: 실제 운영 설정 파일
- `config.example.json`: 설정 예시 파일
- `state.json`: 처리한 메시지 ID, 리포트 발송 여부, 일간/주간 리포트 상태 저장
- `reports/daily`: 일간 HTML 리포트 저장 폴더
- `reports/weekly`: 주간 HTML 리포트 저장 폴더
- `logs`: 실행 로그 저장 폴더
- `run_report.bat`: 일반 실행 또는 스케줄러 등록용 배치 파일
- `run_report_manual.bat`: 일간 리포트 재생성 및 강제 발송용 수동 실행 배치 파일

## 사전 준비

- Python 3.10 이상
- Discord Bot Token
- OpenAI API Key
- SMTP 메일 발송 계정

필수 패키지 설치:

```bash
pip install requests openai
```

## 설정 파일 준비

1. `config.example.json` 파일명을 `config.json`으로 변경합니다.
2. Discord, OpenAI, 이메일 설정을 실제 운영값으로 채웁니다.
3. 채널 목록, 제목 prefix, 프로젝트명 등을 목적에 맞게 수정합니다.

## config.json 구조

`config.json`은 아래 4개 영역으로 나뉩니다.

- `discord`: Discord Bot Token 및 수집 대상 채널 설정
- `openai`: 모델, 출력 토큰 수, 요약 관련 설정
- `email`: SMTP 메일 발송 설정
- `report`: 리포트 동작 방식 설정

## config.json 예시

```json
{
  "discord": {
    "bot_token": "YOUR_DISCORD_BOT_TOKEN",
    "channels": {
      "feedback": [
        { "id": "CHANNEL_ID_1", "name": "feedback-channel" }
      ],
      "bug_report": [
        { "id": "CHANNEL_ID_2", "name": "bug-report-channel" }
      ],
      "event": [],
      "announcement": [],
      "general": [
        { "id": "CHANNEL_ID_3", "name": "general-chat" }
      ]
    }
  },
  "openai": {
    "api_key": "YOUR_OPENAI_API_KEY",
    "model": "gpt-5",
    "max_input_messages": 200,
    "max_output_tokens": 2400,
    "reasoning_effort": "low",
    "text_verbosity": "low"
  },
  "email": {
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "sender_address": "sender@example.com",
    "sender_password": "YOUR_SMTP_PASSWORD_OR_APP_PASSWORD",
    "recipients": [
      "recipient1@example.com",
      "recipient2@example.com"
    ],
    "subject_prefix": "[ProjectName] Discord Report"
  },
  "report": {
    "game_title": "ProjectName",
    "language": "ko",
    "timezone": "Asia/Seoul",
    "window_mode": "calendar_day",
    "daily_days_ago": 1,
    "lookback_hours": 24,
    "daily_send_enabled": true,
    "weekly_enabled": true,
    "weekly_send_weekday": 4,
    "save_html": true
  }
}
```

## 다른 프로젝트로 전환할 때 수정할 항목

- `report.game_title`
- `email.subject_prefix`
- `discord.channels`
- `report.language`
- `report.timezone`
- `email.recipients`

권장 순서:

1. 프로젝트 폴더를 복사합니다.
2. `config.example.json`을 `config.json`으로 변경합니다.
3. Discord Bot Token을 교체합니다.
4. OpenAI API Key를 교체합니다.
5. SMTP 계정과 수신자 목록을 교체합니다.
6. 채널 ID 및 채널명을 운영 서버 기준으로 수정합니다.
7. 프로젝트명과 메일 제목 prefix를 수정합니다.
8. 수동 테스트 후 스케줄러에 등록합니다.

## Discord 설정 방법

1. Discord Developer Portal에서 Application 생성
2. Bot 추가
3. Bot Token을 `config.json`에 입력
4. 서버에 Bot 초대
5. 대상 채널 읽기 권한 확인

필수 권한:

- `View Channels`
- `Read Message History`
- `Read Messages`

채널별 권한 override가 있는 경우 Bot이 일부 채널만 읽지 못할 수 있으므로 별도 확인이 필요합니다.

## 채널 ID 확인 방법

1. Discord에서 개발자 모드 활성화
2. 대상 채널 우클릭
3. 채널 ID 복사
4. `config.json`의 원하는 category 아래에 추가

## OpenAI 설정

권장 기본값:

- `model`: `gpt-5`
- `reasoning_effort`: `low`
- `text_verbosity`: `low`
- `max_output_tokens`: `2400`

설정 이유:

- `reasoning_effort=low`: 비용과 출력 속도 균형
- `text_verbosity=low`: 리포트가 과도하게 길어지는 문제 방지
- `max_output_tokens=2400`: 일간/주간 분석이 중간에 잘리는 문제 완화

## 이메일 설정

이 프로젝트는 SMTP로 HTML 메일을 발송합니다.

Gmail 사용 시:

1. 2단계 인증 활성화
2. 앱 비밀번호 생성
3. 생성한 앱 비밀번호를 `email.sender_password`에 입력

다른 SMTP 서버 사용 시 수정할 항목:

- `smtp_host`
- `smtp_port`
- 발신 계정
- 발신 비밀번호

## 리포트 수집 구간 설정

### 1. `calendar_day` 방식

```json
"window_mode": "calendar_day",
"daily_days_ago": 1
```

이 설정은 실행 시각과 관계없이 로컬 타임존 기준 하루 전체를 사용합니다.

예시:

- 실행 시각: 2026-03-28 09:00
- 기준일: 2026-03-27
- 수집 구간: 2026-03-27 00:00:00 ~ 23:59:59

### 2. `rolling_hours` 방식

```json
"window_mode": "rolling_hours",
"lookback_hours": 24
```

이 설정은 현재 실행 시점 기준으로 최근 N시간을 조회합니다.

## 일간/주간 동작 방식

### 일간 리포트

- 설정된 구간의 메시지를 조회합니다.
- 이미 처리한 메시지는 기본적으로 제외합니다.
- HTML 리포트를 저장합니다.
- 해당 기준일 메일이 아직 발송되지 않았다면 메일을 발송합니다.
- 필요 시 `--force-send-daily`, `--rebuild-daily`로 재실행할 수 있습니다.

### 주간 리포트

- 기준일을 끝점으로 직전 7일 구간을 요약합니다.
- `state.json`에 저장된 일간 리포트 데이터를 기반으로 주간 리포트를 생성합니다.
- 필요한 7일치 일간 데이터가 모두 있어야 주간 리포트를 생성합니다.
- 동일 주간 메일은 기본적으로 한 번만 발송합니다.
- 필요 시 `--force-send-weekly`로 강제 발송할 수 있습니다.

## 주간 리포트 기준일 설명

주간 리포트는 "실행한 날"이 아니라 "이번 실행에서 계산된 기준일(report_date)"을 기준으로 만들어집니다.

예를 들어 아래 설정을 사용한다고 가정합니다.

```json
"window_mode": "calendar_day",
"daily_days_ago": 1,
"weekly_send_weekday": 4
```

이 경우 일반적인 해석은 다음과 같습니다.

- `daily_days_ago = 1`: 매일 실행 시 전날 데이터를 일간 리포트로 생성
- `weekly_send_weekday = 4`: 금요일에 주간 리포트 발송 시도
- 금요일 아침 실행 시 기준일은 목요일이므로, 주간 리포트는 직전 금요일부터 목요일까지 7일을 묶어 요약

예시:

- 실행 시각: 2026-03-28 금요일 09:00
- 기준일: 2026-03-27 목요일
- 주간 범위: 2026-03-21 금요일 ~ 2026-03-27 목요일

즉, 이 프로젝트의 주간 리포트는 "발송 당일 기준 7일"이 아니라 "기준일을 끝점으로 하는 7일"이라고 이해하면 됩니다.

## 주간 리포트가 생성되지 않는 경우

주간 리포트가 실행되더라도 아래 조건이면 생성 또는 발송되지 않을 수 있습니다.

- `weekly_enabled`가 `false`인 경우
- 실행 요일이 `weekly_send_weekday`와 다른 경우
- 기준 7일 중 일부 일간 리포트 데이터가 없는 경우
- 이미 같은 주간 메일이 발송된 상태이고 `--force-send-weekly`를 사용하지 않은 경우

운영 관점에서 가장 흔한 원인은 "직전 7일 중 일부 날짜의 일간 리포트가 누락된 경우"입니다.
따라서 주간 리포트를 안정적으로 발송하려면 일간 리포트가 매일 정상 저장되고 있는지 먼저 확인해야 합니다.

## 주간 운영 권장 방식

권장 설정:

```json
"window_mode": "calendar_day",
"daily_days_ago": 1,
"weekly_enabled": true,
"weekly_send_weekday": 4
```

이 설정의 장점:

- 일간 리포트가 매일 "전날 하루" 단위로 고정되어 해석이 쉽습니다.
- 주간 리포트도 "금요일 발송, 직전 금~목 집계"처럼 운영 기준이 명확해집니다.
- 실행 시각이 조금 변해도 수집 범위가 흔들리지 않습니다.

## 실행 방법

일반 실행:

```bash
python discord_report.py
```

일간 메일 강제 발송:

```bash
python discord_report.py --force-send-daily
```

주간 메일 강제 발송:

```bash
python discord_report.py --force-send-weekly
```

일간 리포트 재생성:

```bash
python discord_report.py --rebuild-daily
```

재생성 후 일간 메일까지 강제 발송:

```bash
python discord_report.py --rebuild-daily --force-send-daily
```

## 테스트 권장 순서

스케줄러 등록 전에 아래 순서로 검증하는 것을 권장합니다.

1. `python discord_report.py --rebuild-daily --force-send-daily` 실행
2. `logs/`에서 Discord/OpenAI 호출 로그 확인
3. `reports/daily/` 아래 생성된 HTML 확인
4. 메일 본문이 HTML과 동일한지 확인
5. `state.json` 갱신 상태 확인

주간 테스트 시 추가 확인 항목:

1. 직전 7일의 `daily_reports` 데이터가 `state.json`에 모두 있는지 확인
2. `weekly_send_weekday`와 실행 요일이 맞는지 확인
3. 필요 시 `python discord_report.py --force-send-weekly`로 강제 발송 테스트
4. `reports/weekly/` 아래 HTML 파일 생성 여부 확인

## Windows Task Scheduler 등록

### `run_report.bat`

일반 스케줄 실행에 사용합니다.

### `run_report_manual.bat`

수동 점검, 재생성, 강제 일간 발송 테스트에 사용합니다.

등록 순서:

1. 작업 스케줄러 실행
2. 새 작업 생성
3. 원하는 시간으로 트리거 추가
4. 동작에 `run_report.bat` 등록
5. 최초 1회는 수동 실행으로 정상 동작 확인

## 운영 시 참고 사항

- `state.json`은 중복 메시지 처리와 발송 상태를 관리하는 핵심 파일입니다.
- 다른 프로젝트로 복제할 때는 `state.json`을 비우거나 새로 시작하는 것이 안전합니다.
- OpenAI 출력이 자주 잘리면 `max_output_tokens`를 조정하세요.
- 수집량이 많은 서버는 `max_input_messages` 조정이 필요할 수 있습니다.
- 카테고리 분류는 `discord.channels` 구조에 따라 결정됩니다.

## 자주 발생하는 문제

`401 Unauthorized`
- Discord Token 또는 OpenAI API Key가 잘못된 경우

`403 Forbidden`
- Bot이 채널을 읽을 권한이 없는 경우

`404 Not Found`
- 채널 ID가 잘못되었거나 삭제된 경우

`429 Too Many Requests`
- OpenAI quota 부족 또는 billing 미설정

JSON 형식 오류
- `config.json` 문법 오류 또는 쉼표/따옴표 누락

OpenAI 분석 실패
- API quota, billing, 모델명, 네트워크 상태 확인

메일 발송 실패
- SMTP 계정 정보, 보안 설정, 앱 비밀번호 확인

같은 메일이 반복 발송됨
- `state.json` 상태와 강제 발송 옵션 사용 여부 확인

## 보안 주의 사항

`config.json`에는 민감 정보가 포함될 수 있습니다.

권장 사항:

- Discord Bot Token 교체 이력 관리
- OpenAI API Key 별도 관리
- SMTP 비밀번호 또는 앱 비밀번호 보호
- 가능하면 비밀값은 환경변수나 별도 비밀 관리 방식으로 분리
- `config.json`, `state.json`을 외부 공개 저장소에 그대로 올리지 않기

## 배포 체크리스트

- `config.example.json`을 `config.json`으로 변경
- 모든 토큰/비밀번호 입력 완료
- 채널 ID 입력 완료
- 프로젝트명/메일 제목 prefix 수정 완료
- 수동 테스트 1회 완료
- `--rebuild-daily --force-send-daily` 테스트 완료
- 주간 강제 발송 테스트 완료
- 스케줄러 등록 완료
- 최초 자동 발송 결과 확인 완료
