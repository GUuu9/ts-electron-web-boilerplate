# 🖥 Renderer Layered Architecture 가이드

이 문서는 프로젝트의 **렌더러(UI) 프로세스** 내부 구조와 각 파일의 동작 및 기능 생성 원칙을 설명합니다.

## 🏗 아키텍처 개요

렌더러 레이어는 프로젝트 전체의 **Layered Architecture** 원칙을 따르며, UI 로직과 인프라 로직을 엄격히 분리하여 관리합니다.

```text
src/renderer/src/
├── core/                # UI 인프라 (라우터, 로거, 공통 서비스)
├── features/            # 도메인 기반 UI 기능 컨트롤러
├── styles/              # 분리된 CSS 스타일 시트
└── main.ts              # 진입점 및 렌더러 전용 DI 컨테이너 조립
```

---

## 🛠 아키텍처 규칙

1. **배럴 파일(`index.ts`) 금지**: `src/core` 하위에서는 의존성 순환 및 불필요한 모듈 로딩을 방지하기 위해 배럴 파일을 사용하지 않으며, 명시적으로 개별 파일을 임포트합니다.
2. **환경 분리 (DI Container)**: 렌더러는 Node.js 전용 모듈(`net`, `dgram`)을 직접 참조할 수 없습니다. 따라서 `container.renderer.ts`는 UI에서 사용 가능한 서비스들만 등록/관리하며, 메인 프로세스 전용 서비스는 IPC 브릿지를 통해서만 간접 호출합니다.

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

### 5. `main.ts` (Bootstrapping)
애플리케이션이 시작될 때 모든 서비스를 인스턴스화하고 의존성을 주입합니다.
- **동작**: `UILogger`, `UIRouter`, 각 `Controller`를 생성하고 `window` 전역 객체에 노출하여 HTML 상의 `onclick` 이벤트와 연결합니다.

---

## 🛠 새로운 테스트 기능 추가 프로세스

새로운 테스트 페이지(예: Database)를 추가할 때는 다음 단계를 따릅니다.

1. **컨트롤러 생성 (`features/`)**: 필요한 서비스를 주입받아 비즈니스 로직 작성.
2. **UI 렌더링 정의 (`core/ui-router.service.ts`)**: `getSubContentHtml`에 HTML 폼 구조 추가.
3. **진입점 등록 (`main.ts`)**: `bootstrap()` 함수에서 컨트롤러 인스턴스화 및 전역 등록.

---

## 🌐 Desktop API (IPC Bridge) 통신 원칙

렌더러 프로세스에서 Node.js 전용 모듈(`net`, `dgram`, `fs`)에 직접 접근하는 것은 보안상 금지되어 있습니다. 따라서 다음 패턴을 엄격히 준수합니다.

1. **Main Process**: 실제 Node.js 기능을 수행하고 결과를 `ipcMain`으로 전송.
2. **Preload Script**: `contextBridge`를 통해 안전한 통로(`electronAPI`)만 렌더러에 노출.
3. **Renderer**: `window.electronAPI.xxx`를 통해 비동기로 통신.
