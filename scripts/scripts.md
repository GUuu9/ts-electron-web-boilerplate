# Python 스크립트 관리 가이드

본 프로젝트는 비전 및 자동화 관련 로직을 Python으로 구현하여 Node.js에서 호출하는 구조를 가지고 있습니다. 파이썬 환경은 앱 내부에 포함되어 있으므로(Embeddable), 스크립트 추가 및 삭제 시 아래 가이드를 준수해야 합니다.

## 1. 스크립트 추가 방법

새로운 기능을 위해 파이썬 스크립트를 추가하려면 다음 단계를 따르세요.

1.  **스크립트 파일 생성:** `scripts/` 폴더 내에 `.py` 파일을 생성합니다.
2.  **의존성 확인:** 추가한 스크립트가 외부 라이브러리를 사용한다면, `scripts/requirements.txt`에 해당 라이브러리를 추가합니다.
3.  **가상환경 업데이트:** 로컬에서 개발 환경의 `venv`에 라이브러리를 설치합니다.
    ```bash
    ./venv/bin/pip install -r scripts/requirements.txt
    ```
4.  **Node.js 연동:** `src/main/features/` 내의 해당 서비스에서 `spawn`을 사용하여 추가한 스크립트를 호출합니다. 경로 설정 시 `vision.server.ts`의 `getPythonPath()`와 `getScriptPath()` 방식을 참고하여 배포 환경 경로를 준수해야 합니다.

## 2. 스크립트 삭제 및 수정

*   **삭제:** 불필요한 스크립트를 `scripts/` 폴더에서 제거하고, 이를 호출하던 Node.js 코드에서도 관련 로직을 제거합니다.
*   **수정:** 스크립트 수정 후에는 반드시 변경된 스크립트가 Electron 빌드 시 포함되는지 확인합니다(`package.json`의 `files` 설정을 통해 자동 포함됩니다).

## 3. 배포 주의사항 (Embeddable Python)

*   **배포 환경:** 빌드 시 `venv/` 폴더와 `scripts/` 폴더가 전체 앱 배포 파일(`release/`)에 포함됩니다.
*   **의존성 관리:** `requirements.txt`에 명시된 라이브러리만 배포용 `venv`에 설치됩니다. 만약 새로운 라이브러리를 추가하고 빌드 시점에 설치되지 않는다면, 빌드 전 `pip install` 과정이 올바르게 수행되었는지 확인하십시오.
*   **파일 시스템:** 스크립트 내에서 파일을 생성하거나 읽을 때는 `process.cwd()` 대신 `temp` 디렉토리와 같이 관리되는 폴더를 사용하십시오.

## 4. 로컬 환경 테스트
개발 시에는 로컬 `venv`를 사용합니다. 스크립트의 동작을 테스트하려면 아래 명령어를 사용하세요.
```bash
# 예시: ./venv/bin/python scripts/your_script.py [인자]
./venv/bin/python scripts/vision_processor.py [인자]
```

## 5. 스크립트별 패키지 의존성

| 스크립트 파일명 | 사용된 주요 패키지 |
| :--- | :--- |
| `scripts/vision_processor.py` | `opencv-python`, `numpy` |
