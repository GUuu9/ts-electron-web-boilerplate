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
│   ├── features/     # 도메인별 ViewModel 및 View 컴포넌트
│   ├── styles/       # 스타일 정의
│   └── main.ts       # 렌더러 진입점
└── shared/           # 공용 계층: 플랫폼 독립적 모델/로직
    └── [service-name]/ # 서비스명 기반 구조 (models, client 등)
```

---

## 🧩 아키텍처 상세 및 파일 역할

### 1. 프론트엔드 (Frontend / Renderer): MVVM
| 레이어 | 역할 및 파일 규칙 |
| :--- | :--- |
| **View** | `*.view.ts`: 순수 HTML 템플릿 렌더링 및 DOM 요소 접근. 비즈니스 로직 금지. |
| **Binder** | `*.view.ts` 내 Binder 클래스: View의 이벤트를 ViewModel 메서드와 연결. |
| **ViewModel** | `*.viewmodel.ts`: UI 상태 관리 및 데이터 가공. Repository를 주입받아 로직 수행. |
| **Repository** | `data/**/*.repository.ts`: 데이터 계층. 백엔드(IPC) 또는 저장소 통신 캡슐화. |

### 2. 백엔드 (Backend / Main): 서비스 기반
| 레이어 | 역할 및 파일 규칙 |
| :--- | :--- |
| **Core Service** | `features/**/*.server.ts` 등: 실제 Node.js API를 사용하는 저수준 서비스. |
| **Core Module** | `features/**/*.core.ts`: `BackendModule` 구현, IPC 핸들러 등록 및 관리. |
| **IPC Bridge** | `features/**/*.bridge.ts`: 백엔드 기능을 렌더러에 노출하는 브릿지 규격. |

### 3. 파일 별칭 및 역할 요약
- `*.view.ts`: **UI 레이아웃**. DOM 구조 생성 및 요소 식별. 로직 금지.
- `*.viewmodel.ts`: **UI 로직**. ViewModel의 상태 관리 및 서비스 호출.
- `*.binder.ts`: **연결 계층**. View 이벤트와 ViewModel 메서드를 바인딩.
- `*.repository.ts`: **데이터 추상화**. 백엔드 IPC 호출/저장소 캡슐화.
- `*.core.ts`: **백엔드 모듈**. 백엔드 인스턴스 관리 및 IPC 통신 운영.

---

## 🚀 개발 가이드
- **런타임**: Node.js v22+
- **데스크탑**: Electron 34+
- **웹**: Vite 6+
- **상세 가이드**: [기능 추가 개발자 가이드](./docs/DEVELOPMENT_GUIDE.md), [다국어 처리 가이드](./docs/I18N_GUIDE.md)를 참조하십시오.
