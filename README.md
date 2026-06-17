# 프로젝트 개요

이 프로젝트는 **Backend(Main Process)**, **Frontend(Renderer)**, 그리고 **Shared(공통 로직)**로 명확히 분리된 계층형 아키텍처를 기반으로 합니다. **의존성 주입(DI)**, **단일 책임 원칙(SRP)**, **MVVM(Model-View-ViewModel)** 패턴을 적용하여 확장 가능하고 유지보수가 용이한 크로스 플랫폼 애플리케이션을 지향합니다.

## 🏗 아키텍처 구조

### 1. 프로세스별 계층 분리
- **`src/main/` (Backend)**: Electron 메인 프로세스. OS 자원 제어, 백엔드 서비스, 시스템 인프라를 담당합니다.
- **`src/renderer/` (Frontend)**: 브라우저 환경. 사용자 인터페이스(UI), 사용자 인터랙션, ViewModel을 통한 상태 관리를 담당합니다.
- **`src/shared/` (Common)**: 플랫폼 의존성이 없는 순수 비즈니스 로직, 모델(Model), 데이터 변환, 행동 트리(AI) 엔진 등을 관리합니다.

### 2. 설계 원칙
- **의존성 주입 (DI)**: 모든 서비스와 컨트롤러는 DI 컨테이너를 통해 관리되어 결합도를 낮춥니다.
- **단일 책임 원칙 (SRP)**: 각 모듈은 하나의 기능적 도메인만을 책임지며, 복잡한 로직은 세부 클래스로 분리합니다.
- **MVVM 패턴**:
  - **Model**: `src/shared/`의 데이터 및 비즈니스 로직.
  - **View**: `src/renderer/`의 사용자 화면 구성 요소.
  - **ViewModel**: `src/renderer/`의 컨트롤러 계층. View의 상태를 관리하고 백엔드와 상호작용합니다.

---

## 📂 폴더 구조 가이드

```text
src/
├── main/             # Backend: OS 자원 및 백엔드 로직
│   ├── core/         # 백엔드 엔진 (DI 컨테이너, IPC 핸들러, Registry)
│   ├── features/     # 도메인별 백엔드 서비스 (Network, Device, OS 등)
│   ├── main.ts       # 앱 진입점 (프로세스 오케스트레이션)
│   └── preload.ts    # 보안 브릿지 (IPC 통신 계층)
├── renderer/         # Frontend: UI/UX 및 ViewModel
│   ├── core/         # UI 인프라 (Router, Logger, UI DI, Navigation)
│   ├── data/         # Data Layer (Repository/DataSource)
│   ├── features/     # 특정 화면(Feature)에 특화된 복합 비즈니스 로직 조합(Service)
│   ├── scenes/       # 도메인별 ViewModel 및 View 컴포넌트(TS, HTML, State)
│   ├── styles/       # 디자인 시스템 (partials/ 모듈화)
│   └── main.ts       # 렌더러 진입점
└── shared/           # 공용 계층: 플랫폼 독립적 모델/로직
    └── [service-name]/ # 서비스명 기반 구조 (models, client 등)
```
---

## 🚀 주요 기능 (Features)

각 기능은 명확한 도메인(Backend 및 Frontend 공통)으로 분리되어 있습니다.

| 도메인 | 설명 |
| :--- | :--- |
| **Automation** | 매크로 빌더, 작업 순서 제어 및 자동화 엔진 관리 |
| **File** | 파일 입출력, 다이얼로그 관리 및 데이터 접근 제어 |
| **Logger** | 애플리케이션 상태 및 동작 로그 기록 및 모니터링 |
| **Media** | 오디오/비디오 처리 및 멀티미디어 제어 |
| **Network** | TCP/UDP 소켓 통신 및 HTTP 통신 기능 |
| **OS** | 시스템 알림, 단축키 처리, 트레이 아이콘 관리 |
| **Persistence** | 애플리케이션 데이터 지속성(저장/불러오기) 관리 |
| **Security** | 암호화/복호화 (AES-GCM, RSA-OAEP) 및 보안 데이터 처리 |
| **Serial** | 시리얼 포트 통신 및 외부 장치 연동 |
| **System** | 전반적인 시스템 상태 제어 및 하드웨어 연동 |
| **Vision** | 화면 캡처, 이미지 프로세싱(엣지 검출) 및 템플릿 매칭 |

---

## 🏗 아키텍처 역할 정의 (Architecture Role Definitions)


### 1. UI & Presentation Layer (Renderer/Frontend)

#### 🎮 View (`src/renderer/scenes/*.view.ts`, `*.view.html`)
- **역할**: 메인 씬 (Back Layer). 상호작용 관리. 템플릿은 별도 HTML 파일로 관리.

#### 📊 ViewModel (`*.viewmodel.ts`)
- **역할**: View와 Service 사이의 상태 중재자.

#### 🧩 UI Component (`src/renderer/scenes/_components/[name]/*.ts`)
- **역할**: View에 직접 삽입 가능한 재사용 UI 요소(Button, Text 등).

### 2. Business Logic Layer (Service)

#### 🌐 Domain Service (`src/renderer/features/[domain]/services/*.service.ts`)
- **역할**: 도메인 엔티티의 **상태 관리 및 비즈니스 로직** 처리. (전역 공유 상태 관리 포함)

#### 🛠 Feature Service (`src/renderer/scenes/[feature]/services/*.service.ts`)
- **역할**: 특정 화면(Feature)에 특화된 **복합 비즈니스 로직** 조합.

### 3. Data & State Layer

#### 💾 State (`*.state.ts`)
- **Scene State**: `src/renderer/scenes/` 하위. 특정 View/ViewModel에서만 사용하는 UI 전용 상태.
- **Domain State**: `src/renderer/features/operationData/` 하위. 여러 씬이나 서비스에서 공유되는 전역 상태.

#### 🗄 Persistence Service (`src/renderer/features/operationData/persistence.service.ts`)
- **역할**: 데이터를 디스크에 저장하고 불러오는 **공통 인프라**.

#### 🗃 Repository (`*.repository.ts` 또는 `source/`)
- **역할**: 원시 데이터(JSON, DB, API)에 접근하는 **데이터 공급원**.

### 4. Architecture Support (DI & Core)

#### 📦 Container (`*.container.ts`)
- **역할**: 객체의 **인스턴스 생성 및 수명 주기** 관리.

#### 📑 Registry (`registry.ts`)
- **역할**: 의존성 주입을 위한 **중앙 등록소**.

#### 🏗 Bridge (`*.bridge.ts`)
- **역할**: Electron의 **Main 프로세스와 Renderer 프로세스 간의 통신** 통로.

---

## 🛠 주요 변경 및 개발 표준 규칙

### 1. UI 디자인 표준
- **HTML/CSS 분리**: 모든 View는 HTML 템플릿(`*.view.html`)과 CSS partial(`styles/partials/`)을 사용하여 모듈화합니다.
- **가이드라인**: [CSS 디자인 가이드](./docs/CSS_STYLE_GUIDE.md)를 준수하십시오.

### 2. 상태 관리 표준
- **상태 정의 및 분리**:
  - **Local State (Scene State)**: 해당 씬에서만 필요한 데이터는 `scenes/**/state.ts`에 위치합니다.
  - **Shared State (Domain State)**: 여러 기능/씬에서 공유해야 하는 데이터는 `features/**/state.ts`에 위치합니다.
- **상태 변경 감지**: 모든 상태 클래스는 `BaseState`를 상속받아 `subscribe(callback: () => void)`를 구현합니다. 데이터 변경 시 `notify()`를 호출하여 구독자에게 전파합니다.

### 3. 성능 최적화 (AI 엔진)
- **생명주기 최적화**: AI 엔진(`AIRunner`)은 `AIView`가 렌더링될 때만 시작하고, 이탈 시 `destroy()`를 통해 중지하여 리소스 낭비를 방지합니다.

### 4. 의존성 격리 규칙
- **View(Scene/ViewModel)**는 `features/[domain]/services/`에 있는 도메인 서비스 또는 Feature Service만 호출할 수 있습니다.
- **Repository**는 오직 `Domain Service` 내부에서만 사용하며, 외부로 절대 노출하지 않습니다.

---

## 🚀 개발 가이드
- **런타임**: Node.js v22+
- **데스크탑**: Electron 34+
- **웹**: Vite 6+
- **상세 가이드**: [기능 추가 개발자 가이드](./docs/DEVELOPMENT_GUIDE.md), [다국어 처리 가이드](./docs/I18N_GUIDE.md)를 참조하십시오.

---

## 🤖 로컬 AI/LLM 개발 설정

이 프로젝트는 로컬 환경에서 실행되는 `llama.cpp` (`llama-server`)를 데스크탑 앱 내부에서 통합하여 실행할 수 있도록 지원합니다.

### 1. llama-server 바이너리 배치 경로
프로젝트 루트의 `bin/` 디렉토리에 실행 환경에 맞추어 `llama-server` 바이너리를 직접 내장해 주세요.
* **macOS (ARM64/Intel)**: `bin/darwin/llama-server`
* **Windows (64-bit)**: `bin/win32/llama-server.exe`
* **Linux (x64)**: `bin/linux/llama-server`

### 2. GGUF 모델 설정 및 다운로드
* 앱 실행 후 **모델 관리 (Pull)** 탭에서 예약 키워드 `qwen`을 입력하고 다운로드 버튼을 누르면 기본 성능이 우수한 `Qwen2.5-Coder-0.5B-Instruct` 모델이 다운로드 경로인 `models/` 폴더에 자동으로 다운로드되어 저장됩니다.
* 개별적인 모델을 이용하려면 Hugging Face의 direct LFS 다운로드 URL(예: `.gguf` 확장자 경로)을 직접 입력하여 저장할 수 있습니다.

> [!NOTE]
> 상세한 바이너리 다운로드 명령어 가이드 및 OS별 바이너리 설치 매뉴얼은 [Local AI 개발 가이드](./docs/LLM_GUIDE.md) 문서를 참고해 주시기 바랍니다.
