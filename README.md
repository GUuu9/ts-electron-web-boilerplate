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
│   ├── scenes/       # 도메인별 ViewModel 및 View 컴포넌트
│   ├── styles/       # 스타일 정의
│   └── main.ts       # 렌더러 진입점
└── shared/           # 공용 계층: 플랫폼 독립적 모델/로직
    └── [service-name]/ # 서비스명 기반 구조 (models, client 등)
```

---

## 🏗 아키텍처 역할 정의 (Architecture Role Definitions)

아키텍처의 일관성을 유지하고 각 파일의 책임을 명확히 하기 위해 다음과 같이 역할을 정의합니다.

### 1. UI & Presentation Layer (Renderer/Frontend)

#### 🎮 View (`src/renderer/scenes/*.view.ts`)
- **역할**: 게임의 메인 씬 (Back Layer). 게임 플레이, 월드 이동, 상호작용 관리.

#### 📊 ViewModel (`*.viewmodel.ts`)
- **역할**: View와 Service 사이의 상태 중재자.

#### 🧩 UI Component (`src/renderer/scenes/_components/[name]/*.ts`)
- **역할**: View에 직접 삽입 가능한 재사용 UI 요소(Button, Text 등).

### 2. Business Logic Layer (Service)

#### 🌐 Domain Service (`src/renderer/features/[domain]/services/*.service.ts`)
- **역할**: 도메인 엔티티의 **상태 관리 및 비즈니스 로직** 처리.

#### 🛠 Feature Service (`src/renderer/scenes/[feature]/services/*.service.ts`)
- **역할**: 특정 화면(Feature)에 특화된 **복합 비즈니스 로직** 조합.

### 3. Data & State Layer

#### 💾 Domain State (`src/renderer/features/operationData/[domain]/*.state.ts`)
- **역할**: 해당 도메인에 국한된 **단일 진실 공급원(SSOT)**.

#### 🗄 Persistence Service (`src/renderer/features/operationData/persistence.service.ts`)
- **역할**: 데이터를 디스크에 저장하고 불러오는 **공통 인프라**.

#### 📂 Game Data Service (`src/renderer/features/operationData/game-data.service.ts`)
- **역할**: 전체 시스템의 **데이터 생명주기** 관리.

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

## 🛠 개발 및 리팩토링 표준 규칙

### 1. 의존성 격리 규칙
- **View(Scene/ViewModel)**는 `features/operationData/[domain]/services/`에 있는 도메인 서비스 또는 Feature Service만 호출할 수 있습니다.
- **Repository**는 오직 `Domain Service` 내부에서만 사용하며, 외부로 절대 노출하지 않습니다.

### 2. 상태 변경 감지 표준
- 모든 **Domain State**는 `BaseState`를 상속받아 `subscribe(callback: () => void)`를 구현합니다.
- 데이터가 변경되면 반드시 서비스 내부에서 상태를 업데이트하고 `notify()`를 호출하여 구독 중인 ViewModel에게 갱신 알림을 전파해야 합니다.

---

## 🚀 개발 가이드
- **런타임**: Node.js v22+
- **데스크탑**: Electron 34+
- **웹**: Vite 6+
- **상세 가이드**: [기능 추가 개발자 가이드](./docs/DEVELOPMENT_GUIDE.md), [다국어 처리 가이드](./docs/I18N_GUIDE.md)를 참조하십시오.
