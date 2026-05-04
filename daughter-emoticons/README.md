# daughter-emoticons

`daughter-emoticons`는 OpenAI Images API를 이용해 카카오톡 정적 이모티콘용 이미지를 자동 생성하는 프로젝트입니다.  
아빠와 딸 캐릭터를 같은 스타일로 유지하면서 32장의 이모티콘과 대표 아이콘까지 한 번에 만드는 것을 목표로 합니다.

## 프로젝트 구성

- `generate_images.py`: 프롬프트 목록을 읽어 360x360 PNG를 생성하고, 마지막에 아이콘까지 만듭니다.
- `optimize_icon.py`: 대표 이미지를 78x78 카카오 아이콘 규격으로 줄이고 용량을 최적화합니다.
- `base_prompt.txt`: 모든 이미지에 공통으로 적용되는 캐릭터/화풍 설명입니다.
- `prompts.json`: 개별 이모티콘 문구와 장면 프롬프트 목록입니다.
- `reference_style.png`: 캐릭터 일관성을 맞추기 위한 기준 이미지입니다.
- `output/360`: 생성된 360x360 결과물 저장 폴더입니다.
- `output/icon`: 최종 78x78 아이콘 저장 폴더입니다.

## 작업 흐름

1. `base_prompt.txt`와 `reference_style.png`로 공통 캐릭터 스타일을 고정합니다.
2. `prompts.json`에 정의된 32개 감정/상황 프롬프트를 순서대로 생성합니다.
3. 결과 이미지를 `output/360`에 저장합니다.
4. 첫 번째 이미지(`01_좋아.png`)를 기준으로 78x78 아이콘을 만들어 `output/icon`에 저장합니다.

## 준비 사항

Python 3.11 이상을 권장합니다.

```powershell
pip install openai pillow
```

OpenAI API 키도 필요합니다.

```powershell
$env:OPENAI_API_KEY="your_api_key"
```

## 사용 방법

기본 실행:

```powershell
python .\generate_images.py
```

일부만 테스트 생성:

```powershell
python .\generate_images.py --limit 3
```

기존 파일까지 다시 생성:

```powershell
python .\generate_images.py --overwrite
```

아이콘 생성만 별도로 실행:

```powershell
python .\optimize_icon.py --input .\output\360\01_좋아.png --output .\output\icon\01_좋아_icon.png
```

## 주요 옵션

- `--prompts`: 프롬프트 JSON 파일 경로
- `--base-prompt`: 공통 프롬프트 파일 경로
- `--reference-image`: 기준 이미지 경로
- `--reference-fidelity`: 기준 이미지 반영 강도 (`low`, `high`)
- `--model`: 이미지 생성 모델명
- `--size`: 원본 생성 크기
- `--quality`: 생성 품질
- `--limit`: 앞에서부터 N개만 생성
- `--overwrite`: 기존 결과 덮어쓰기
- `--skip-icon`: 마지막 아이콘 생성 생략

## 출력 규칙

- 본문 이모티콘: `output/360/*.png`
- 대표 아이콘: `output/icon/*.png`
- 파일명은 `prompts.json`의 `no`, `name`, `text` 정보를 바탕으로 정해집니다.

## 메모

- `reference_style.png`가 없으면 텍스트 프롬프트만으로 생성되지만, 캐릭터 일관성이 떨어질 수 있습니다.
- 카카오 제출 전에는 생성 결과의 문구, 여백, 가독성, 캐릭터 통일감을 한 번 더 확인하는 것이 좋습니다.
