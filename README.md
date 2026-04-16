# TypeScript + Electron + Web 통합 개발 보일러플레이트

이 프로젝트는 **Layered Architecture (계층형 아키텍처)**와 **의존성 주입(Dependency Injection)** 패턴을 적용하여, 하나의 소스 코드로 **웹 브라우저**와 **데스크탑(Mac, Windows, Linux)** 환경을 동시에 지원하도록 설계되었습니다.

## 🚀 핵심 특징 (Core Features)

- **One Codebase, Multi-Platform**: Vite와 Electron을 결합하여 웹과 데스크탑 화면을 동시에 개발 및 배포합니다.
- **Shared Business Logic**: `src/shared` 폴더의 로직은 플랫폼(Node.js/Browser)에 관계없이 공통으로 사용됩니다.
- **Secure Desktop Integration**: `Context Isolation` 및 `Preload` 스크립트를 통해 웹 화면에서 안전하게 데스크탑 OS API를 호출합니다.
- **Layered Architecture**: Controller-Service-Repository 패턴을 지향하여 유지보수성과 확장성을 극대화합니다.

---

## 🏗 아키텍처 구조 (Architecture)

### 1. 계층 분리 (Layered Architecture)
- **Renderer (UI)**: Vite + TypeScript 기반의 프론트엔드 (웹 브라우저 및 Electron 화면).
- **Main (Desktop Core)**: Electron 메인 프로세스로 OS 자원(파일 시스템, 창 관리 등) 제어.
- **Shared (Core Logic)**: 플랫폼 독립적인 순수 비즈니스 로직 및 유틸리티.

### 2. 폴더 구조 가이드
```text
src/
├── core/             # 앱의 핵심 인프라 (DB, DI, Network, Route)
├── features/         # 도메인 기반 기능 모듈 (회원가입, 게시판 등)
├── shared/           # 플랫폼 공용 서비스 및 유틸리티 (비즈니스 로직)
├── renderer/         # 프론트엔드 UI 소스 (Vite 기반)
│   ├── public/       # 정적 자산
│   └── src/          # UI 스크립트 및 컴포넌트
├── main.ts           # Electron 메인 프로세스 (데스크탑 진입점)
└── preload.ts        # Electron 보안 브릿지 (API 노출)
```

---

## 🛠 기술 스택 (Tech Stack)

- **Language**: TypeScript 5.x
- **Runtime**: Node.js v22.x (LTS) - `nvm` 사용 권장
- **Desktop**: Electron 34.x (Chromium + Node.js)
- **Web/Bundler**: Vite 6.x
- **Packaging**: Electron Builder (dmg, exe, AppImage 지원)
- **Testing**: Vitest

### 📦 주요 패키지 및 용도 (Key Packages & Purpose)

| 패키지명 | 용도 | 상세 설명 |
| :--- | :--- | :--- |
| **typescript** | 언어 및 타입 안정성 | 전 과정에서 타입 체크를 통해 런타임 에러를 방지하고 최신 문법을 지원합니다. |
| **electron** | 데스크탑 앱 프레임워크 | Chromium과 Node.js를 결합하여 웹 기술로 크로스 플랫폼 데스크탑 앱을 구동합니다. |
| **vite** | 빌드 도구 및 개발 서버 | 매우 빠른 HMR(Hot Module Replacement)을 제공하며, 웹 및 렌더러 소스를 번들링합니다. |
| **electron-builder** | 패키징 및 배포 | 작성된 코드를 Mac(.dmg), Win(.exe), Linux용 단독 실행 파일로 패키징합니다. |
| **vitest** | 단위 테스트 | Vite 기반의 빠른 테스트 환경을 제공하여 공유 로직(Service)의 안정성을 검증합니다. |
| **@types/node** | Node.js 타입 정의 | Electron 메인 프로세스에서 Node.js API(fs, path 등)를 사용할 때 타입 힌트를 제공합니다. |

---

## 🛠 코어 기능 및 호환성 (Core Features & Compatibility)

이 프로젝트의 코어 기능들은 실행 환경(Web vs Desktop)에 따라 사용 가능 여부가 다릅니다.

| 기능 (Core) | 호환성 (Web/OS) | 사용 패키지 (Dependencies) | 용도 |
| :--- | :--- | :--- | :--- |
| **DI Container** | 전 플랫폼 공용 | 자체 구현 (TypeScript) | 객체 생명주기 및 의존성 주입 관리 |
| **HttpClient** | 전 플랫폼 공용 | `axios` | REST API 통신 (HTTP/HTTPS) |
| **SocketClient** | 전 플랫폼 공용 | `socket.io-client` | 실시간 양방향 이벤트 통신 (JSON, N회 수신 지원) |
| **TcpClient** | **Desktop 전용** | `net` (Node.js 내장) | 저수준 스트림 통신 (IPC 브릿지 방식) |
| **UdpClient** | **Desktop 전용** | `dgram` (Node.js 내장) | 비연결형 패킷 통신 (IPC 브릿지 방식) |
| **Database** | **Desktop 전용** | `sqlite3` (예정) | 로컬 SQLite 데이터베이스 관리 |
| **Route/API** | **Desktop 전용** | `express` (예정) | 로컬 서버 엔드포인트 제공 |
| **BluetoothService** | 전 플랫폼 공용 | `Web Bluetooth API` | 블루투스 LE 장치 검색 및 통신 |
| **UsbService** | 전 플랫폼 공용 | `Web MediaDevices API` | 전용 USB 기기, 게임패드, 커스텀 컨트롤러 연결 |
| **MediaService** | 전 플랫폼 공용 | `WebHID API` | 마이크, 헤드셋 목록 확인 및 오디오 스트림 획득 |
| **LoggerService** |  |  |  |

---

## ⚙️ 실행 및 빌드 가이드 (Developer Guide)

### 1. 환경 설치 (Node.js v22 권장)
프로젝트의 최신 패키지들은 Node.js v22 이상의 환경을 필요로 합니다. `nvm`이 설치되어 있다면 다음 명령어로 버전을 맞출 수 있습니다.

```bash
# Node.js v22 설치 및 사용
nvm install 22
nvm use 22

# 의존성 설치
npm install
```

### 2. 개발 모드 실행
- **Web 브라우저 실행**: `npm run dev` (http://localhost:5173)
- **데스크탑 앱 실행**: `npm run electron:dev` (Vite 서버 구동 후 실행)

### 3. 빌드 및 배포
- **웹 전용 빌드**: `npm run build:web` (`dist/` 폴더 생성)
- **플랫폼별 앱 배포**: `npm run dist` (`release/` 폴더에 dmg, exe, AppImage 생성)

---

## 🎨 앱 커스터마이징 (Customizing)

애플리케이션의 이름과 아이콘을 본인의 브랜드에 맞춰 수정하는 방법입니다.

### 1. 앱 이름(표시명) 수정
-   **데스크탑 앱 이름**: `package.json`의 `"productName": "My App Name"` 필드를 수정하세요. (설치 파일명 및 창 제목에 반영됨)
-   **웹 탭 제목**: `src/renderer/index.html`의 `<title>My App Name</title>` 태그를 수정하세요.

### 2. 아이콘 수정
-   **데스크탑 앱 아이콘 (Electron)**: 
    -   `build/` 폴더에 `icon.png` (1024x1024 권장) 파일을 넣으세요.
    -   macOS: `icon.icns`, Windows: `icon.ico` 파일을 직접 넣어두면 우선적으로 사용됩니다.
-   **웹 브라우저 아이콘 (Favicon)**: 
    -   `src/renderer/public/favicon.ico` 파일을 교체하세요.

---

## 🧭 개발 중 주기적으로 관리해야 할 파일 (Key Maintenance Files)

1.  **`src/core/di/container.ts`**: 새로운 `Service`나 `Controller` 클래스를 등록하여 주입 체계를 완성합니다.
2.  **`src/main.ts` & `src/preload.ts`**: OS 전용 기능 호출을 위한 IPC 통신을 정의합니다.
3.  **`package.json`**: 라이브러리 추가 및 앱 배포 설정을 관리합니다.
4.  **`.env` & `.env.example`**: 환경 변수 및 보안 키를 관리합니다.

---

## 🏗 Dependency Injection (DI) 가이드

애플리케이션의 **의존성 주입(Dependency Injection)**과 **객체 생명주기**를 중앙에서 관리하는 핵심 인프라 [DI_GUIDE.md](./src/core/di/DI_GUIDE.md)

---

## 🔌 Device Control 가이드  

블루투스, USB, HID, 미디어(마이크/헤드셋) 장치를 연결하고 제어하는 인프라 계층 [DEVICE_GUIDE.md](./src/core/device/DEVICE_GUIDE.md)

---

## 🌐 Network Infra 가이드

다양한 프로토콜(HTTP, TCP, UDP, Socket.io)을 통한 외부 통신을 담당하는 인프라 계층 [NETWORK_GUIDE.md](./src/core/network/NETWORK_GUIDE.md)

---

## 🔒 OS별 권한 설정 가이드 (Permissions)

macOS Sandbox, Windows 방화벽 등 운영체제별 네트워크 및 하드웨어 접근 권한 가이드 [PERMISSION_GUIDE.md](./PERMISSION_GUIDE.md)

---

## 🖥 Renderer Architecture 가이드

Vite 기반의 렌더러 프로세스 내부 구조와 UI 레이어드 아키텍처 및 IPC 통신 원칙 [RENDERER_GUIDE.md](./src/renderer/RENDERER_GUIDE.md)

---

## 📜 변경 이력 (Changelog)

프로젝트의 상세한 개발 단계, 실행 명령어, 핵심 코드 변경 내역은 [CHANGELOG.md](./CHANGELOG.md)
