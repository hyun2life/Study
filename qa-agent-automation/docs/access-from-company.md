# Access From Company

이 문서는 회사 PC에서 QA Daily Report Bot 자료를 다시 확인하는 방법을 정리합니다.

## GitHub에서 바로 보기

현재 작업물은 GitHub 원격 저장소에 올라가 있습니다.

- 저장소: `https://github.com/hyun2life/Study`
- 프로젝트 폴더: `qa-agent-automation/`
- 프로젝트 README: `https://github.com/hyun2life/Study/tree/main/qa-agent-automation`
- 회사 적용 가이드: `https://github.com/hyun2life/Study/blob/main/qa-agent-automation/docs/company-adoption-guide.md`
- 운영 준비 체크리스트: `https://github.com/hyun2life/Study/blob/main/qa-agent-automation/docs/production-readiness.md`

회사에서 GitHub 접속이 가능하다면 위 링크만 열어도 문서와 코드를 볼 수 있습니다.

## 회사 PC에 내려받기

회사 PC에서 직접 실행해보고 싶다면 아래 순서로 clone합니다.

```bash
git clone https://github.com/hyun2life/Study.git
cd Study/qa-agent-automation
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app/main.py --preview paths --show-paths
```

macOS 또는 Linux 환경이면 가상환경 활성화 명령만 아래처럼 바꾸면 됩니다.

```bash
source .venv/bin/activate
```

## 회사에서 먼저 열어볼 파일

1. `qa-agent-automation/README.md`
2. `qa-agent-automation/docs/company-adoption-guide.md`
3. `qa-agent-automation/docs/data-contract.md`
4. `qa-agent-automation/docs/integration-plan.md`
5. `qa-agent-automation/docs/production-readiness.md`

## 회사 적용 전 주의사항

- 개인 GitHub 저장소가 회사 보안 정책에 맞는지 먼저 확인합니다.
- 회사 코드를 이 저장소에 바로 올리지 않습니다.
- 회사 token, webhook, 이메일 비밀번호 같은 secret을 커밋하지 않습니다.
- 실제 연동 전에는 mock data로 리포트 모양만 먼저 공유합니다.
- 회사 저장소에 적용할 때는 새 사내 repository로 옮기는 것이 안전할 수 있습니다.

## 개인 저장소 접근이 막힌 경우

회사 네트워크에서 개인 GitHub 저장소 접근이 막힐 수 있습니다. 그 경우 아래 방식 중 하나를 사용합니다.

1. 회사에서 허용된 사내 Git 저장소에 프로젝트 구조만 옮깁니다.
2. 필요한 문서만 회사 문서 도구에 복사합니다.
3. 코드는 `qa-agent-automation/` 폴더 단위로 zip 전달 후 사내 repo에 import합니다.

단, 회사 이슈 데이터나 secret을 개인 저장소로 다시 가져오면 안 됩니다.
