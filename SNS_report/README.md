# Discord / Facebook 커뮤니티 리포트 운영 가이드

이 프로젝트는 Discord 채널 메시지와 Facebook 페이지 게시글/댓글을 수집하고, OpenAI로 요약 분석한 뒤, HTML 리포트 저장과 이메일 발송까지 자동화합니다.
특정 게임 전용이 아니라 다른 프로젝트에도 그대로 복제해서 사용할 수 있도록 구성했습니다.

## 개요

- 지정한 Discord 채널의 메시지를 수집합니다.
- 지정한 Facebook 페이지의 게시글과 댓글을 수집합니다.
- Discord 일간 리포트를 생성합니다.
- Discord 주간 리포트를 생성합니다.
- Facebook 일간 리포트를 별도 파일로 생성합니다.
- OpenAI 기반 요약과 운영 인사이트를 만듭니다.
- HTML 파일을 저장하고 이메일로 발송합니다.
- Discord 중복 메시지 처리와 중복 발송을 방지합니다.

## 폴더 구조

```text
discord_report/
|-- discord_report.py
|-- config.json
|-- config.example.json
|-- .env
|-- .env.example
|-- run_report.bat
|-- run_report_manual.bat
|-- state.json
|-- reports/
|   |-- daily/
|   |-- facebook_daily/
|   `-- weekly/
`-- logs/
```

## 주요 파일 설명

- `discord_report.py`: 메인 실행 스크립트
- `config.json`: Discord/Facebook 수집 대상, 리포트 옵션, 비밀이 아닌 운영 설정
- `config.example.json`: `config.json` 예시 파일
- `.env`: 토큰, API 키, 메일 계정 비밀번호 같은 비밀값 파일
- `.env.example`: `.env` 예시 파일
- `state.json`: Discord/Facebook 리포트 상태 저장
- `reports/daily`: Discord 일간 HTML 리포트 저장 폴더
- `reports/facebook_daily`: Facebook 일간 HTML 리포트 저장 폴더
- `reports/weekly`: 주간 HTML 리포트 저장 폴더
- `logs`: 실행 로그 저장 폴더
- `run_report.bat`: 일반 실행 또는 스케줄러 등록용 배치 파일
- `run_report_manual.bat`: 일간 리포트 재생성 및 강제 발송용 수동 실행 배치 파일

## `.env`가 무엇인지 쉽게 이해하기

`.env`는 "비밀 설정 메모장"이라고 생각하면 됩니다.

- `config.json`: 공개돼도 괜찮은 운영 설정
- `.env`: 공개되면 안 되는 비밀값

예를 들면 아래처럼 나눕니다.

- `config.json`에는 Discord 채널 ID, Facebook 페이지 ID, 시간대, 리포트 기간, 주간 발송 요일
- `.env`에는 Discord Bot Token, Facebook Page Access Token, OpenAI API Key, SMTP 비밀번호

이렇게 나누는 이유는 단순합니다.

- 깃에 올릴 때 비밀값이 섞일 가능성을 줄입니다.
- 다른 프로젝트에 복사할 때 비밀값만 교체하기 쉬워집니다.
- 예시 파일을 공유해도 민감 정보가 노출되지 않습니다.

## 사전 준비

- Python 3.10 이상
- Discord Bot Token
- Facebook Page Access Token
- OpenAI API Key
- SMTP 메일 발송 계정

필수 패키지 설치:

```bash
pip install requests openai
```

## 설정 파일 준비

1. `config.example.json`을 `config.json`으로 복사합니다.
2. `.env.example`을 `.env`로 복사합니다.
3. `config.json`에는 채널 목록과 리포트 옵션을 입력합니다.
4. `.env`에는 비밀값을 입력합니다.

## `config.json` 역할

`config.json`은 아래처럼 비밀이 아닌 값 위주로 관리합니다.

- Discord 채널 목록
- 프로젝트명
- 언어
- 시간대
- 리포트 수집 방식
- 주간 발송 요일
- HTML 저장 여부

예시:

```json
{
  "discord": {
    "bot_token": "",
    "channels": {
      "feedback": [],
      "bug_report": [
        { "category_id": "CATEGORY_ID_1", "name": "bug-report-category" }
      ],
      "event": [],
      "announcement": [
        { "id": "CHANNEL_ID_2", "name": "announcement-channel" }
      ],
      "general": [
        { "category_id": "CATEGORY_ID_3", "name": "general-chat-category" }
      ]
    }
  },
  "facebook": {
    "enabled": false,
    "page_access_token": "",
    "send_daily_email": true,
    "graph_api_version": "v23.0",
    "pages": [
      { "page_id": "PAGE_ID_1", "name": "Official Facebook Page" }
    ]
  },
  "openai": {
    "api_key": "",
    "model": "gpt-5",
    "max_input_messages": 200,
    "max_output_tokens": 2400,
    "reasoning_effort": "low",
    "text_verbosity": "low"
  },
  "email": {
    "smtp_host": "smtp.gmail.com",
    "smtp_port": 587,
    "sender_address": "",
    "sender_password": "",
    "recipients": [],
    "subject_prefix": "[ProjectName] Community Report"
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

- `id`: 특정 채널 하나만 수집합니다.
- `category_id`: 해당 Discord 카테고리 아래의 텍스트/공지 채널을 자동으로 찾아 모두 수집합니다.
- 같은 리포트 category 안에서 `id`와 `category_id`를 함께 써도 됩니다.
- `facebook.enabled`: Facebook 리포트 사용 여부입니다.
- `facebook.pages`: 수집할 Facebook 페이지 목록입니다.
- `facebook.send_daily_email`: Facebook 일간 리포트 메일 발송 여부입니다.
- `facebook.graph_api_version`: 사용할 Meta Graph API 버전입니다.

주의:

- `config.json` 안의 `bot_token`, `api_key`, `sender_password` 같은 값은 비워두고 `.env`로 옮기는 것을 권장합니다.
- `facebook.page_access_token`도 비워두고 `.env`에서 관리하는 것을 권장합니다.
- 코드에서는 `.env` 값을 우선 읽고, 없으면 `config.json` 값을 fallback으로 사용합니다.

## `.env` 역할

`.env`는 비밀값 전용 파일입니다.

예시:

```env
DISCORD_BOT_TOKEN=여기에_디스코드_봇_토큰
FACEBOOK_PAGE_ACCESS_TOKEN=여기에_페이스북_페이지_액세스_토큰
OPENAI_API_KEY=여기에_OpenAI_API_키
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SENDER_ADDRESS=sender@example.com
SMTP_SENDER_PASSWORD=여기에_앱비밀번호
SMTP_RECIPIENTS=recipient1@example.com,recipient2@example.com
EMAIL_SUBJECT_PREFIX=[ProjectName] Community Report
```

설명:

- `DISCORD_BOT_TOKEN`: Discord 봇 토큰
- `FACEBOOK_PAGE_ACCESS_TOKEN`: Facebook 페이지 액세스 토큰
- `OPENAI_API_KEY`: OpenAI API 키
- `SMTP_SENDER_ADDRESS`: 발신 메일 주소
- `SMTP_SENDER_PASSWORD`: SMTP 비밀번호 또는 앱 비밀번호
- `SMTP_RECIPIENTS`: 쉼표로 구분한 수신자 목록
- `EMAIL_SUBJECT_PREFIX`: 메일 제목 앞에 붙는 공통 문구

## 다른 프로젝트로 전환할 때 바꾸면 되는 것

`config.json`에서 바꿀 것:

- `discord.channels`
- `facebook.enabled`
- `facebook.pages`
- `report.game_title`
- `report.language`
- `report.timezone`
- `report.window_mode`
- `report.daily_days_ago`
- `report.weekly_send_weekday`

`.env`에서 바꿀 것:

- `DISCORD_BOT_TOKEN`
- `FACEBOOK_PAGE_ACCESS_TOKEN`
- `OPENAI_API_KEY`
- `SMTP_SENDER_ADDRESS`
- `SMTP_SENDER_PASSWORD`
- `SMTP_RECIPIENTS`
- `EMAIL_SUBJECT_PREFIX`

## Discord 설정 방법

1. Discord Developer Portal에서 Application 생성
2. Bot 추가
3. Bot Token 준비
4. 대상 서버에 Bot 초대
5. 읽을 채널에 권한 부여

필수 권한:

- `View Channels`
- `Read Message History`
- `Read Messages`

## 채널 ID / 카테고리 ID 확인 방법

1. Discord에서 개발자 모드 활성화
2. 대상 채널 또는 카테고리 우클릭
3. `ID 복사`
4. `config.json`의 원하는 category 아래에 추가
5. 채널 하나만 넣을 때는 `{ "id": "..." }`, 카테고리 전체를 넣을 때는 `{ "category_id": "..." }` 형식을 사용

## Facebook 설정 방법

1. Meta 개발자 설정에서 Page Access Token을 준비합니다.
2. 운영 중인 Facebook 페이지의 `page_id`를 확인합니다.
3. `config.json`의 `facebook.pages`에 `{ "page_id": "...", "name": "..." }` 형식으로 추가합니다.
4. `.env`의 `FACEBOOK_PAGE_ACCESS_TOKEN`에 토큰을 입력합니다.
5. Facebook 리포트를 사용할 때는 `facebook.enabled`를 `true`로 설정합니다.

참고:

- 현재 구현은 `Facebook 페이지 게시글`과 `해당 게시글의 댓글`을 별도 리포트로 분석합니다.
- Facebook 리포트는 Discord와 섞지 않고 `reports/facebook_daily/` 아래에 별도 HTML로 저장합니다.
- Discord 주간 리포트는 기존과 동일하게 유지됩니다.

## OpenAI 설정

권장 기본값:

- `model`: `gpt-5`
- `reasoning_effort`: `low`
- `text_verbosity`: `low`
- `max_output_tokens`: `2400`

## 이메일 설정

Gmail 사용 시:

1. 2단계 인증 활성화
2. 앱 비밀번호 생성
3. 생성한 앱 비밀번호를 `.env`의 `SMTP_SENDER_PASSWORD`에 입력

## 리포트 수집 구간 설정

### 1. `calendar_day`

```json
"window_mode": "calendar_day",
"daily_days_ago": 1
```

로컬 타임존 기준 하루 전체를 사용합니다.

예시:

- 실행 시각: 2026-03-28 09:00
- 기준일: 2026-03-27
- 수집 구간: 2026-03-27 00:00:00 ~ 23:59:59

### 2. `rolling_hours`

```json
"window_mode": "rolling_hours",
"lookback_hours": 24
```

현재 실행 시점을 기준으로 최근 N시간을 조회합니다.

## 일간/주간 동작 방식

### 일간 리포트

- Discord는 설정된 구간의 메시지를 조회합니다.
- Facebook은 설정된 페이지의 게시글과 댓글을 조회합니다.
- Discord 일간 HTML은 `reports/daily/`에 저장합니다.
- Facebook 일간 HTML은 `reports/facebook_daily/`에 저장합니다.
- 해당 기준일 메일이 아직 발송되지 않았다면 각 리포트를 메일로 발송합니다.
- 필요 시 `--force-send-daily`, `--rebuild-daily`로 다시 실행할 수 있습니다.

### 주간 리포트

- Discord 주간 리포트만 생성합니다.
- 기준일을 끝점으로 직전 7일 구간을 요약합니다.
- `state.json`에 저장된 일간 데이터가 모두 있어야 생성됩니다.
- 동일 주간 메일은 기본적으로 한 번만 발송합니다.
- `--force-send-weekly`를 사용하면 지정 요일이 아니어도 주간 리포트 생성을 시도합니다.

## 주간 기준 예시

아래 설정을 사용한다고 가정합니다.

```json
"window_mode": "calendar_day",
"daily_days_ago": 1,
"weekly_send_weekday": 4
```

이 경우:

- 매일 실행 시 전날 데이터를 일간 리포트로 생성
- 금요일 실행 시 기준일은 목요일
- 주간 리포트는 직전 금요일부터 목요일까지 7일을 묶어 생성

예시:

- 실행 시각: 2026-03-28 금요일 09:00
- 기준일: 2026-03-27 목요일
- 주간 범위: 2026-03-21 ~ 2026-03-27

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

1. `.env`와 `config.json`이 모두 채워졌는지 확인
2. `python discord_report.py --rebuild-daily --force-send-daily` 실행
3. `logs/`에서 Discord/Facebook/OpenAI 호출 로그 확인
4. `reports/daily/` 아래 Discord HTML 생성 확인
5. Facebook을 켠 경우 `reports/facebook_daily/` 아래 HTML 생성 확인
6. 메일 수신 확인
7. `state.json` 갱신 확인

주간 테스트 시:

1. 직전 7일의 일간 데이터가 `state.json`에 있는지 확인
2. `python discord_report.py --force-send-weekly` 실행
3. `reports/weekly/` 생성 여부 확인

## Windows Task Scheduler 등록

### `run_report.bat`

일반 스케줄 실행에 사용합니다.

### `run_report_manual.bat`

수동 점검, 재생성, 강제 일간 발송 테스트에 사용합니다.

## 자주 발생하는 문제

`401 Unauthorized`

- Discord Token, Facebook Page Access Token 또는 OpenAI API Key가 잘못된 경우

`403 Forbidden`

- Bot이 Discord 채널을 읽을 권한이 없는 경우
- Facebook 페이지/댓글 조회 권한이 없는 경우

`404 Not Found`

- 채널 ID 또는 Facebook 페이지 ID가 잘못되었거나 삭제된 경우

`429 Too Many Requests`

- OpenAI quota 부족 또는 billing 미설정

`config.json` 오류

- JSON 문법 오류
- 쉼표, 따옴표 누락

`.env` 오류

- `KEY=VALUE` 형식이 아니거나 키 이름이 틀린 경우
- 수신자 목록을 쉼표 없이 입력한 경우

메일 발송 실패

- SMTP 계정 정보, 보안 설정, 앱 비밀번호 확인

## 보안 주의 사항

- `.env`, `config.json`, `state.json`은 외부 공개 저장소에 올리지 않는 것이 안전합니다.
- 특히 `.env`에는 실제 토큰과 비밀번호가 들어가므로 반드시 `.gitignore`에 포함해야 합니다.
- 비밀값이 한 번이라도 외부에 노출됐다고 판단되면 즉시 재발급하는 것이 안전합니다.
- 프로젝트를 다른 사람에게 전달할 때는 `.env.example`, `config.example.json`만 전달하는 방식이 가장 깔끔합니다.

## 배포 체크리스트

- `config.example.json`을 `config.json`으로 복사 완료
- `.env.example`을 `.env`로 복사 완료
- Discord 채널 ID 입력 완료
- Facebook 사용 시 페이지 ID 입력 완료
- 토큰/비밀번호 입력 완료
- 수동 테스트 1회 완료
- Discord 일간 메일 수신 확인 완료
- Facebook 사용 시 Facebook 일간 메일 수신 확인 완료
- 주간 강제 발송 테스트 완료
- 스케줄러 등록 완료
