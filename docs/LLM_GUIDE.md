# Local AI/LLM Proxy (llm) 개발 가이드

이 가이드는 프로젝트에 추가된 `llm` 도메인의 아키텍처, 구현 상세 및 사용 방법에 대해 설명합니다. 이 모듈은 로컬에서 실행되는 **llama.cpp (llama-server)**를 프록시하여 애플리케이션 내에서 LLM 기능을 사용할 수 있게 합니다.

---

## 🏗 아키텍처 구조

`llm` 도메인은 프로젝트의 표준 계층형 아키텍처를 준수합니다.

### 1. 계층별 역할

| 계층 | 파일 경로 | 역할 |
| :--- | :--- | :--- |
| **Shared** | `src/shared/llm/models.ts` | 공통 인터페이스 정의 |
| **Main (Backend)** | `src/main/features/llm/llm.server.ts` | llama-server HTTP API (Port: 8080)와 직접 통신 |
| | `src/main/features/llm/llm.manager.ts` | **내장** llama-server 프로세스 생명주기 관리 |
| | `src/main/features/llm/llm.core.ts` | IPC 핸들러 등록 |
| | `src/main/features/llm/llm.bridge.ts` | Renderer 프로세스에 노출할 브릿지 API |
| **Renderer** | `src/renderer/domains/llm/` | LLM 비즈니스 로직 및 UI 인터페이스 |

---

## 🛠 바이너리 내장 가이드 (중요)

본 프로젝트는 외부 의존성을 줄이기 위해 `llama-server` 바이너리를 직접 내장하는 방식을 지원합니다.

### 1. 바이너리 배치 경로
프로젝트 루트 폴더의 `bin/` 디렉토리에 각 운영체제별로 아래와 같이 배치합니다.
```text
bin/
├── darwin/          # macOS
│   └── llama-server
├── win32/           # Windows
│   └── llama-server.exe
└── linux/           # Linux
    └── llama-server
```

---

### 2. OS별 llama-server 다운로드 및 배치 방법

#### 🍎 macOS (Apple Silicon M1/M2/M3 또는 Intel)
터미널을 열고 프로젝트 루트 디렉토리에서 아래 명령어를 실행하여 최신 공식 릴리즈 바이너리를 받고 압축을 풀어 배치합니다.

**Apple Silicon (M1/M2/M3 등 ARM64)**:
```bash
# darwin 폴더 생성
mkdir -p bin/darwin

# 공식 릴리즈 zip 다운로드 (b4698 버전 예시, 필요 시 버전 번호 변경 가능)
curl -L -o temp_llama.zip https://github.com/ggml-org/llama.cpp/releases/download/b4698/llama-b4698-bin-macos-arm64.zip

# 압축 해제 후 llama-server 파일 이동
unzip -j temp_llama.zip "llama-server" -d bin/darwin/

# 실행 권한 부여 및 임시 파일 삭제
chmod +x bin/darwin/llama-server
rm temp_llama.zip
```

**Intel Mac (x64)**:
```bash
mkdir -p bin/darwin
curl -L -o temp_llama.zip https://github.com/ggml-org/llama.cpp/releases/download/b4698/llama-b4698-bin-macos-x64.zip
unzip -j temp_llama.zip "llama-server" -d bin/darwin/
chmod +x bin/darwin/llama-server
rm temp_llama.zip
```

#### 🪟 Windows (64-bit)
PowerShell을 관리자 권한으로 열고 프로젝트 루트에서 실행하거나, 웹 브라우저에서 다운로드 받아 수동으로 복사합니다.

**PowerShell 스크립트**:
```powershell
# win32 폴더 생성
New-Item -ItemType Directory -Force -Path "bin/win32"

# 공식 릴리즈 zip 다운로드
Invoke-WebRequest -Uri "https://github.com/ggml-org/llama.cpp/releases/download/b4698/llama-b4698-bin-win-simple-x64.zip" -OutFile "temp_llama.zip"

# 압축 해제 후 llama-server.exe 파일 이동
Expand-Archive -Path "temp_llama.zip" -DestinationPath "temp_extracted" -Force
Move-Item -Path "temp_extracted/llama-server.exe" -Destination "bin/win32/llama-server.exe" -Force

# 임시 파일 정리
Remove-Item -Recurse -Force "temp_llama.zip", "temp_extracted"
```

#### 🐧 Linux (x64)
리눅스 서버 환경의 경우 아래 쉘 명령어를 실행합니다.
```bash
mkdir -p bin/linux
curl -L -o temp_llama.zip https://github.com/ggml-org/llama.cpp/releases/download/b4698/llama-b4698-bin-ubuntu-x64.zip
unzip -j temp_llama.zip "llama-server" -d bin/linux/
chmod +x bin/linux/llama-server
rm temp_llama.zip
```

---

## 📥 로컬 GGUF 모델 다운로드 가이드

로컬 AI를 실행하기 위해서는 가볍고 검증된 `.gguf` 포맷의 LLM 모델이 필요합니다. 애플리케이션 내의 **모델 추가 (Pull)** 창에 직접 Hugging Face의 다운로드 주소(Direct URL)를 입력하거나 예약 키워드를 입력해 다운로드할 수 있습니다.

### 1. 예약 키워드 다운로드
* **키워드**: `qwen`
* **설명**: 입력 창에 `qwen`을 입력하고 다운로드 버튼을 누르면, 코딩과 한국어 성능이 우수한 `Qwen2.5-Coder-0.5B-Instruct-GGUF (Q4_K_M)` 모델이 지정된 다운로드 경로(`https://huggingface.co/Qwen/Qwen2.5-Coder-0.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-0.5b-instruct-q4_k_m.gguf`)를 통해 `models/` 디렉토리에 자동으로 다운로드됩니다.

### 2. Hugging Face Direct URL 입력 다운로드
Hugging Face의 특정 모델 저장소 내 `Files and versions` 탭에서 원하는 `.gguf` 파일의 **download(LFS)** 링크 주소를 복사하여 직접 입력창에 붙여넣기하면 다운로드가 수행됩니다.

* **추천 모델 주소 예시**:
  * **Qwen 2.5 Coder 1.5B (가벼운 코딩/일반용)**:
    `https://huggingface.co/Qwen/Qwen2.5-Coder-1.5B-Instruct-GGUF/resolve/main/qwen2.5-coder-1.5b-instruct-q4_k_m.gguf`
  * **Llama 3.2 1B (가볍고 범용적인 비서용)**:
    `https://huggingface.co/lmstudio-community/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf`

다운로드된 모델은 프로젝트 루트 폴더의 `models/` 디렉토리에 저장되며, 렌더러 화면에서 새 모델을 선택하면 `llama-server`가 해당 모델을 로드하여 재시작합니다.

---

## ⚠️ 주의 사항

- **실행 권한**: macOS/Linux 환경에서 `bin/<os>/llama-server` 파일에 실행 권한이 없더라도 앱이 자동으로 부여(`chmod +x`)하도록 구현되어 있습니다.
- **포트 충돌**: `llama-server`는 8080 포트를 사용합니다. 해당 포트를 사용하는 다른 프로세스가 있으면 실행되지 않습니다.
- **바이너리 빌드 호환성**: macOS 환경에서는 다운로드받은 바이너리가 최초 실행 시 시스템 보안 정책에 의해 차단될 수 있습니다. 이 경우 시스템 설정의 `개인정보 보호 및 보안` 탭에서 실행을 허용해 주어야 정상 구동됩니다.

```terminal
# macOS darwin 에 권한 지정
xattr -dr com.apple.quarantine ~/Downloads/llama.cpp
xattr -dr com.apple.quarantine [이 자리에 폴더 드래그]
```