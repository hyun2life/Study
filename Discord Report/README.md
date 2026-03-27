# Discord 일간/주간 리포트 가이드

이 문서는 Discord 채널 메시지를 수집하고, OpenAI로 요약 분석한 뒤, HTML 리포트와 이메일로 발송하는 프로젝트를 다른 게임이나 서비스에도 재사용할 수 있도록 정리한 공통 운영 가이드입니다.

## 개요

이 프로젝트는 다음 작업을 자동화합니다.

- 지정한 Discord 채널의 메시지 수집
- 일간 리포트 생성
- 주간 리포트 생성
- OpenAI 기반 요약 및 이슈 분석
- HTML 파일 저장
- 이메일 발송
- 중복 메시지 및 중복 발송 방지

## 폴더 구조

```text
discord_report/
|-- discord_report.py
|-- config.json
|-- run_report.bat
|-- state.json
|-- reports/
|   |-- daily/
|   `-- weekly/
`-- logs/
```

## 주요 파일 설명

- `discord_report.py`: 메인 실행 스크립트
- `config.json`: Discord, OpenAI, 이메일, 리포트 설정
- `state.json`: 처리한 메시지 id, 발송 여부, 저장된 분석 결과
- `reports/daily`: 일간 HTML 리포트
- `reports/weekly`: 주간 HTML 리포트
- `logs`: 실행 로그
- `run_report.bat`: Windows 스케줄러 실행용 배치 파일
- `run_report_manual.bat`: 수동 실행

## 필수 준비 사항

- Python 3.10 이상
- Discord Bot Token
- OpenAI API Key
- SMTP 발송 계정

필요 패키지 설치:

```bash
pip install requests openai
```

## config.json 구조

`config.json`은 아래 4개 영역으로 나뉩니다.

- `discord`: 봇 토큰과 채널 목록
- `openai`: 모델 및 요약 생성 설정
- `email`: SMTP 발송 설정
- `report`: 리포트 동작 설정

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
    "lookback_hours": 24,
    "game_title": "ProjectName",
    "language": "ko",
    "timezone": "Asia/Seoul",
    "daily_send_enabled": true,
    "weekly_enabled": true,
    "weekly_send_weekday": 4,
    "save_html": true
  }
}
```

## 다른 프로젝트로 전환할 때 수정할 항목

다른 게임이나 서비스에 재사용할 때는 아래 항목부터 바꾸면 됩니다.

- `report.game_title`
- `email.subject_prefix`
- `discord.channels`
- `report.language`
- `report.timezone`
- `email.recipients`

권장 순서:

1. 프로젝트 폴더를 복사한다.
2. 새 Discord Bot Token으로 교체한다.
3. 새 OpenAI API Key로 교체한다.
4. SMTP 계정과 수신자를 교체한다.
5. 채널 id와 채널명을 대상 서버 기준으로 바꾼다.
6. `game_title`, 제목 prefix를 바꾼다.
7. 수동 테스트 후 스케줄 등록한다.

## Discord 설정 방법

1. Discord Developer Portal에서 새 Application 생성
2. Bot 추가
3. Bot Token을 `config.json`에 입력
4. 서버에 봇 초대
5. 대상 채널 읽기 권한 확인

최소 권한:

- `View Channels`
- `Read Message History`
- `Read Messages`

채널별 권한 override가 있으면 봇이 일부 채널만 읽지 못할 수 있으니 확인이 필요합니다.

## 채널 ID 확인 방법

1. Discord에서 개발자 모드 활성화
2. 대상 채널 우클릭
3. 채널 ID 복사
4. `config.json`의 적절한 category 아래에 추가

## OpenAI 설정

1. OpenAI Platform에서 API Key 생성
2. Billing 활성화
3. 해당 프로젝트에서 사용할 모델 접근 가능 여부 확인

현재 권장 기본값:

- `model`: `gpt-5`
- `reasoning_effort`: `low`
- `text_verbosity`: `low`
- `max_output_tokens`: `2400`

설정 이유:

- `reasoning_effort=low`: 내부 추론 토큰 과소모 방지
- `text_verbosity=low`: 리포트 과다 출력 방지
- `max_output_tokens=2400`: 섹션형 분석문이 중간에 잘리는 문제 완화

## 이메일 설정

이 프로젝트는 SMTP로 HTML 메일을 발송합니다.

Gmail 사용 시:

1. 2단계 인증 활성화
2. 앱 비밀번호 생성
3. 생성한 앱 비밀번호를 `email.sender_password`에 입력

다른 SMTP 서버 사용 시 바꿔야 하는 항목:

- `smtp_host`
- `smtp_port`
- 발신 계정
- 발신 비밀번호

## 일간/주간 동작 방식

일간 리포트:

- 최근 `lookback_hours` 범위 메시지 조회
- 이미 처리한 메시지는 기본적으로 제외
- HTML 리포트 저장
- 이미 보낸 날짜가 아니면 메일 발송

주간 리포트:

- 저장된 일간 리포트 데이터를 기반으로 생성
- `weekly_send_weekday`에 맞는 날만 발송
- 기본적으로 동일 주간 중복 발송 방지

## 실행 방법

기본 실행:

```bash
python discord_report.py
```

일간 메일 강제 재발송:

```bash
python discord_report.py --force-send-daily
```

주간 메일 강제 재발송:

```bash
python discord_report.py --force-send-weekly
```

최근 수집 범위를 다시 분석해서 일간 리포트 재생성 + 재발송:

```bash
python discord_report.py --rebuild-daily --force-send-daily
```

`--rebuild-daily`는 테스트 중에 특히 유용합니다. 이미 처리한 메시지라도 같은 lookback 구간을 다시 분석하게 해줍니다.

## 테스트 권장 절차

스케줄 등록 전에 아래 순서로 검증하는 것을 권장합니다.

1. `python discord_report.py --rebuild-daily --force-send-daily` 실행
2. `logs/`에서 OpenAI 호출 성공 여부 확인
3. `reports/daily/` 아래 HTML 파일 확인
4. 메일 본문이 HTML과 동일한지 확인
5. `state.json` 업데이트 상태 확인

## Windows Task Scheduler 등록

예시 `run_report.bat`:

```bat
@echo off
cd /d C:\path\to\discord_report
python discord_report.py >> logs\scheduler.log 2>&1
```

Python 경로를 직접 지정해야 하는 경우:

```bat
@echo off
cd /d C:\path\to\discord_report
C:\Python311\python.exe discord_report.py >> logs\scheduler.log 2>&1
```

스케줄러 등록 순서:

1. 작업 스케줄러 실행
2. 새 작업 생성
3. 일간 트리거 추가
4. 동작에 `run_report.bat` 등록
5. 저장 후 수동 실행 테스트

## 운영 시 참고 사항

- `state.json`은 런타임 상태 파일입니다.
- 다른 프로젝트로 복사할 때는 `state.json`을 비우거나 새로 시작하는 것이 안전합니다.
- 실운영 전에는 메일 수신자 범위를 좁혀 검증하는 것이 좋습니다.
- OpenAI 출력이 잘리면 `max_output_tokens`를 더 늘릴 수 있습니다.
- 메시지량이 많은 서버는 `max_input_messages` 조정이 필요할 수 있습니다.

## 자주 발생하는 문제

`401 Unauthorized`
- Discord 토큰 또는 OpenAI 키가 잘못된 경우

`403 Forbidden`
- 봇이 채널을 읽을 권한이 없는 경우

`429 Too Many Requests`
- OpenAI API quota 부족 또는 billing 미설정

`400 unsupported_parameter`
- 모델과 API 파라미터 조합이 맞지 않는 경우

OpenAI 호출은 성공하지만 분석문이 비정상적일 때
- `max_output_tokens` 부족 여부 확인
- 로그에서 `incomplete` 관련 경고 확인
- `reasoning_effort`, `text_verbosity` 설정 확인

메일이 안 올 때
- SMTP 계정 정보 확인
- SMTP 보안 정책 확인
- 수신자 주소 확인

같은 메일이 반복 발송될 때
- `state.json` 확인
- 스케줄 실행에는 강제 발송 옵션을 넣지 않는 것이 안전

## 보안 주의 사항

현재 구조는 `config.json`에 민감정보를 담을 수 있습니다. 다른 프로젝트에 재사용할 때는 아래를 권장합니다.

- Discord Bot Token 교체
- OpenAI API Key 교체
- SMTP 비밀번호 또는 앱 비밀번호 교체
- 가능하면 환경변수나 별도 비밀 관리 방식으로 분리
- `config.json`, `state.json`을 그대로 외부 저장소에 올리지 않기

## 재사용 체크리스트

- 프로젝트 폴더 복사
- 모든 비밀값 교체
- 채널 id 교체
- 프로젝트명 및 제목 prefix 수정
- 수동 테스트 1회 수행
- `--rebuild-daily --force-send-daily` 테스트 1회 수행
- 스케줄러 등록
- 첫 자동 발송 결과 확인
