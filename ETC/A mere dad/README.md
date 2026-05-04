# A mere dad

`A mere dad`는 완성된 이모티콘 원본을 카카오톡 제출용 PNG로 정리하고 다듬는 후처리 프로젝트입니다.  
시리즈별 결과물을 관리하면서 배경 제거, 흰색 외곽선 추가, 360x360 리사이즈, 78x78 아이콘 생성까지 이어지는 작업을 담당합니다.

## 프로젝트 구성

- `scripts/create_sticker_pngs.py`: 흰 배경 원본에서 피사체를 분리하고 흰색 외곽선을 넣은 투명 PNG를 만듭니다.
- `scripts/resize_for_kakao.py`: PNG를 카카오 정적 이모티콘 규격에 맞게 360x360으로 리사이즈합니다.
- `scripts/create_kakao_icon.py`: 대표 이미지를 78x78 아이콘으로 만들고 용량을 최적화합니다.
- `base_prompt.txt`: 시리즈 제작 시 참고하는 공통 캐릭터/스타일 설명입니다.

## 시리즈 폴더 구조

현재 결과물은 시리즈별로 나뉘어 있습니다.

- `Daily Talk`
- `Baseball Life`

각 시리즈는 아래 구조를 공통으로 사용합니다.

- `Original`: 원본 이미지
- `PNG`: 배경 제거와 외곽선 처리가 끝난 투명 PNG
- `Last`: 카카오 제출용 최종 360x360 PNG와 아이콘

예시:

```text
Daily Talk/
  Original/
  PNG/
  Last/
```

## 권장 작업 흐름

1. 원본 이미지를 시리즈의 `Original` 폴더에 넣습니다.
2. `create_sticker_pngs.py`로 투명 배경 + 흰 외곽선 PNG를 `PNG` 폴더에 생성합니다.
3. `resize_for_kakao.py`로 360x360 제출용 이미지를 `Last` 폴더에 생성합니다.
4. 대표 이미지 1장을 골라 `create_kakao_icon.py`로 78x78 아이콘을 생성합니다.

## 준비 사항

Python 3.11 이상을 권장합니다.

```powershell
pip install pillow
```

## 사용 방법

### 1. 스티커용 PNG 만들기

```powershell
python ".\scripts\create_sticker_pngs.py" --input-dir ".\Daily Talk\Original" --output-dir ".\Daily Talk\PNG"
```

### 2. 카카오 제출용 360x360 만들기

```powershell
python ".\scripts\resize_for_kakao.py" --input-dir ".\Daily Talk\PNG" --output-dir ".\Daily Talk\Last"
```

### 3. 78x78 대표 아이콘 만들기

```powershell
python ".\scripts\create_kakao_icon.py" --input ".\Daily Talk\Original\icon.png" --output ".\Daily Talk\Last\icon-kakao-78.png"
```

`Baseball Life`도 같은 방식으로 폴더 경로만 바꿔서 실행하면 됩니다.

## 스크립트 옵션

### `create_sticker_pngs.py`

- `--threshold`: 배경으로 볼 밝기 기준값, 기본값 `245`
- `--stroke`: 외곽선 두께, 기본값 `18`

### `resize_for_kakao.py`

- `--size`: 출력 크기, 기본값 `360`
- `--colors`: 팔레트 수, 기본값 `256`

### `create_kakao_icon.py`

- `--threshold`: 배경 판별 기준값
- `--size`: 아이콘 크기, 기본값 `78`
- `--padding`: 가장자리 여백, 기본값 `4`
- `--stroke`: 외곽선 두께, 기본값 `3`
- `--colors`: 최대 팔레트 수, 기본값 `128`
- `--max-bytes`: 최대 파일 크기, 기본값 `16384`

## 운영 메모

- 시리즈가 늘어나면 같은 구조로 새 폴더를 추가하면 관리하기 쉽습니다.
- `Original -> PNG -> Last` 흐름을 유지하면 원본 보존, 중간 산출물 확인, 최종 제출본 관리가 명확해집니다.
- 카카오 업로드 전에는 해상도, 투명 배경, 외곽선, 파일 용량, 대표 아이콘 규격을 마지막으로 점검하는 것을 권장합니다.
