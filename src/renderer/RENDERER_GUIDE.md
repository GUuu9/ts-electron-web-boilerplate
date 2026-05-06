# 🖥 Renderer Layered Architecture 가이드

이 문서는 프로젝트의 **렌더러(UI) 프로세스** 내부 구조와 각 파일의 동작 및 기능 생성 원칙을 설명합니다.

## 🏗 아키텍처 개요

렌더러 레이어는 프로젝트 전체의 **Layered Architecture** 원칙을 따르며, UI 로직과 인프라 로직을 엄격히 분리하여 관리합니다.

```text
src/renderer/src/
├── core/                # UI 인프라 (라우터, 로거, 공통 서비스, 설정)
├── features/            # 도메인 기반 UI 기능
│   ├── [domain]/
│   │   ├── [domain].controller.ts  # 비즈니스 로직 및 이벤트 핸들링
│   │   └── [domain].view.ts        # HTML 템플릿 정의 (컴포넌트화)
├── styles/              # 분리된 CSS 스타일 시트
└── main.ts              # 진입점 및 의존성 주입(DI) 조립
```

---

## 🛠 아키텍처 및 리팩토링 규칙

1. **배럴 파일(`index.ts`) 금지**: `src/core` 하위에서는 의존성 순환 및 불필요한 모듈 로딩을 방지하기 위해 배럴 파일을 사용하지 않으며, 명시적으로 개별 파일을 임포트합니다.
2. **환경 분리 (DI Container)**: 렌더러는 Node.js 전용 모듈(`net`, `dgram`)을 직접 참조할 수 없습니다. 
3. **단일 책임 원칙 (SRP) 및 View-Controller 분리**: 
   - **View 클래스**: 특정 도메인의 **HTML 템플릿(문자열)**을 생성하고 관리합니다. 로직을 포함하지 않으며 순수하게 구조만 담당합니다.
   - **Controller 클래스**: 사용자의 입력을 받아 비즈니스 로직을 수행하고, Core 서비스를 호출합니다. UI 구조(HTML)에 직접 의존하지 않습니다.
   - **UIRouterService (Orchestrator)**: 각 도메인의 View 인스턴스를 주입받아 화면 전환 시 적절한 HTML을 렌더링 영역에 공급합니다. 이로써 단일 파일이 거대해지는 'God Object' 문제를 방지합니다.

---

## 📐 컨트롤러 설계 원칙 (Hub-Delegate Flow)

새로운 대단위 기능(예: Database)을 추가할 때는 다음 흐름을 권장합니다.

1.  **Flow**: `HTML Event` → `HubController` (입력값 추출/UI 제어) → `SubController` (로직 수행) → `Core Service`
2.  **의존성 주입 (DI)**: `main.ts`에서 하위 컨트롤러를 먼저 생성하고, 이를 허브 컨트롤러의 생성자로 주입합니다.

### 💡 실제 적용 사례: Shared Data Converter
- **Shared Logic**: `src/shared/converter.service.ts` (플랫폼 독립적)
- **UI Controller**: `src/renderer/src/features/shared/converter.controller.ts` (UI 연동)
- **Hub**: `window.sharedController` (사용자 입력 추출 및 서비스 결과 출력)

---

---

## 🎨 스타일 및 디자인 시스템

프로젝트의 스타일은 유지보수성을 위해 두 개의 파일로 분리되어 관리됩니다.
- **`styles/main.css`**: 글로벌 변수(`:root`), 배경 그라데이션, 레이아웃 프레임워크, 전역 스크롤바 디자인 정의.
- **`styles/components.css`**: 카드, 버튼, 탭, 입력 폼, 모달창 등 개별 컴포넌트의 스타일 정의. 줄바꿈 및 스크롤 안정성(`scrollbar-gutter`) 포함.

---

## 📂 주요 파일별 역할 및 코드 예시

### 1. `core/ui-logger.service.ts` (Logging)
화면 하단의 로그 패널에 텍스트를 출력하고 관리합니다.
- **기능**: 실시간 로그 추가, 에러 강조, 로그 패널 자동 스크롤.

### 2. `core/ui-router.service.ts` (View Management)
메인 대시보드와 각 테스트 상세 페이지 간의 화면 전환을 담당합니다.
- **기능**: 뷰 상태 관리, 서브 탭(Tab) 시스템 렌더링, Lucide 아이콘 초기화.

### 3. `features/network/network.controller.ts` (Network Bridge)
네트워크 테스트 폼의 입력값을 처리하고 실제 코어 서비스와 연결합니다.
- **주요 기능**: HTTP 호출, TCP/UDP IPC 브릿지 연동, Socket.io 실시간 테스트.

### 4. `features/device/device.controller.ts` (Hardware Control)
통합 장치 선택 모달과 미디어 테스트를 관리합니다.
- **Unified Picker**: 블루투스, USB, HID 장치 목록을 하나의 모달 UI로 렌더링.
- **Media Testing**: `AudioContext`를 이용한 마이크 분석, `video` 태그를 이용한 카메라 프리뷰, 스피커 비프음 테스트 지원.
- **Persistence**: `localStorage`를 통해 사용자 선호 장치 정보를 영구 저장.

### 6. UI Logger & Floating Interface
UI Logger는 앱 전역에서 접근 가능한 플로팅 인터페이스로 설계되었습니다.
- **상태 관리**: `UILoggerService`가 창의 위치, 크기, 도킹 여부, 분리 여부를 중앙에서 관리합니다.
- **인터랙션**: 마우스 이벤트를 통한 드래그(Drag)와 리사이즈(Resize)가 지원되며, 화면 경계(Boundary)를 이탈하지 않도록 클램핑 로직이 적용되어 있습니다.
- **하이브리드 모드**: 웹 환경에서는 플로팅/도킹을 지원하며, 데스크탑 환경에서는 IPC를 통한 외부 OS 창 분리(Detach) 기능을 추가로 지원합니다.

---

## 🛠 새로운 테스트 기능 추가 프로세스

새로운 테스트 페이지(예: Database)를 추가할 때는 다음 단계를 따릅니다.

1. **View 생성 (`features/`)**: 해당 도메인 폴더에 `xxx.view.ts`를 만들고 HTML 템플릿을 작성합니다.
2. **컨트롤러 생성 (`features/`)**: 필요한 서비스를 주입받아 비즈니스 로직을 작성합니다.
3. **라우터 등록 (`core/ui-router.service.ts`)**: `tabs` 객체에 메뉴 명칭을 추가합니다.
4. **진입점 조립 (`main.ts`)**: `bootstrap()` 함수에서 View와 컨트롤러를 인스턴스화하고, View를 `uiRouter` 생성자에 주입합니다.

---

## 🌐 Desktop API (IPC Bridge) 통신 원칙

렌더러 프로세스에서 Node.js 전용 모듈(`net`, `dgram`, `fs`)에 직접 접근하는 것은 보안상 금지되어 있습니다. 따라서 다음 패턴을 엄격히 준수합니다.

1. **Main Process**: 실제 Node.js 기능을 수행하고 결과를 `ipcMain`으로 전송.
2. **Preload Script**: `contextBridge`를 통해 안전한 통로(`electronAPI`)만 렌더러에 노출.
3. **Renderer**: `window.electronAPI.xxx`를 통해 비동기로 통신.
