# Study

개인 학습, 자동화 실험, 문서화 작업을 모아두는 저장소입니다.

작업 주제가 서로 달라서 프로젝트 단위로 폴더를 나누어 관리합니다. 각 폴더는 가능한 한 자체 `README.md`를 두고, 실행 방법과 산출물 위치를 해당 README에서 확인할 수 있게 유지합니다.

## 폴더 구성

| 폴더 | 내용 | README |
| --- | --- | --- |
| `SNS_report/` | Discord/Facebook 커뮤니티 메시지를 수집하고 OpenAI 요약, HTML 리포트, 이메일 발송까지 처리하는 자동화 실험 | [`SNS_report/README.md`](SNS_report/README.md) |
| `WSOP-Full-Site-QA-Automation/` | WSOP 전체 사이트 QA 자동화를 모듈 단위로 설계하는 상위 작업 공간 | [`WSOP-Full-Site-QA-Automation/README.md`](WSOP-Full-Site-QA-Automation/README.md) |
| `WSOP-Player-Standings-Crawler-Improved/` | WSOP Player Standings, Player Profile, Result 상세 데이터 정합성 검증 크롤러 | [`WSOP-Player-Standings-Crawler-Improved/README.md`](WSOP-Player-Standings-Crawler-Improved/README.md) |
| `daughter-emoticons/` | OpenAI Images API를 이용한 카카오톡 정적 이모티콘 이미지 생성 실험 | [`daughter-emoticons/README.md`](daughter-emoticons/README.md) |
| `ETC/` | 메인 프로젝트 바깥의 보조 프로젝트와 결과물 보관 공간 | [`ETC/README.md`](ETC/README.md) |
| `PM/` | PM 업무 흐름, 우선순위 판단, 대시보드 시안 관련 문서와 HTML | [`PM/README.md`](PM/README.md) |

## 별도 관리 폴더

`paintjaengi/`는 페인트 시공 브랜드용 정적 웹 프로젝트입니다. 현재 이 저장소의 `.gitignore`에서 제외되어 있으며, 폴더 내부에 별도 Git 저장소가 있습니다. 루트 저장소에서 함께 커밋하지 않고 독립 프로젝트로 관리합니다.

## 빠른 실행 메모

### SNS 리포트

```powershell
cd SNS_report
python discord_report.py
```

실제 실행 전에는 `config.example.json`과 `.env.example`을 각각 `config.json`, `.env`로 복사하고 필요한 값을 채워야 합니다.

### WSOP Player Standings 크롤러

```powershell
cd WSOP-Player-Standings-Crawler-Improved
.\RUN_WSOP_PLAYER_CRAWLER_LIVE.bat
```

로컬 로직만 빠르게 확인하려면 아래 self-test를 사용합니다.

```powershell
cd WSOP-Player-Standings-Crawler-Improved
npm.cmd run crawl:self-test
```

### 딸 이모티콘 생성

```powershell
cd daughter-emoticons
python .\generate_images.py --limit 3
```

이미지 생성에는 `OPENAI_API_KEY` 환경 변수가 필요합니다.

## Git 관리 원칙

- `.env`, 실제 설정값, 실행 상태 파일, 로그, 리포트, 브라우저 인증 캐시, `node_modules`, 생성 이미지 등은 커밋하지 않습니다.
- 공유가 필요한 설정은 `*.example.*` 형태의 예시 파일로 관리합니다.
- 실행 결과물은 각 프로젝트 README에 적힌 출력 폴더에서 확인하되, 저장소에는 필요한 구조용 `.gitkeep`만 남깁니다.
- 폴더를 새로 추가하거나 이동하면 루트 README와 해당 폴더 README를 함께 갱신합니다.
