# TypeScript + Electron + Phaser.js 게임 개발 보일러플레이트

이 프로젝트는 **Phaser.js** 게임 엔진과 **Layered Architecture**를 결합하여, 고성능 데스크탑 및 웹 게임을 빠르게 개발할 수 있도록 설계된 보일러플레이트입니다. 기존의 강력한 네트워크 및 보안 인프라를 그대로 활용할 수 있습니다.

---

## 🚀 핵심 특징 (Core Features)

- **Phaser.js Integrated**: 업계 표준 2D 게임 엔진인 Phaser 3.x가 사전 설정되어 있습니다.
- **One Codebase, Multi-Platform**: 웹 브라우저와 데스크탑 앱을 동시에 개발하고 배포합니다.
- **Shared Business Logic**: `src/shared` 폴더의 로직은 게임 엔진과 독립적으로 운영되며, 서버와 클라이언트 간에 공유될 수 있습니다.
- **Multiplayer Ready**: `SocketClient`가 DI 컨테이너에 내장되어 있어 즉시 멀티플레이 기능을 구현할 수 있습니다.
- **Secure Integration**: Electron의 OS API를 Phaser 씬 내에서 안전하게 호출할 수 있습니다.

---

## 🏗 아키텍처 구조 (Architecture)

### 1. 계층 분리
- **Game (UI/Engine)**: Phaser.js 기반의 게임 씬 및 렌더링 레이어.
- **Core (Infrastructure)**: 네트워크, 보안, DI 등 게임 외부의 핵심 시스템.
- **Shared**: 플랫폼 독립적인 순수 비즈니스 로직(데이터 변환, 보안 알고리즘 등).

### 2. 폴더 구조
```text
src/
├── core/             # [Main/Renderer Shared] 앱의 핵심 인프라 (Network, Security, DI)
├── shared/           # [Universal] 플랫폼 공용 비즈니스 로직
├── renderer/         # [Phaser Engine] 게임 화면 및 클라이언트 로직
│   ├── src/
│   │   ├── game/     # 게임 씬 및 엔진 설정
│   │   │   ├── scenes/  # Phaser Scenes (MainScene, BootScene 등)
│   │   │   └── PhaserGame.ts  # 엔진 초기화 클래스
│   │   ├── core/     # UI 전용 인프라 (Logger, Settings)
│   │   └── main.ts   # 렌더러 진입점 및 부트스트랩
│   └── index.html    # 게임 캔버스 컨테이너
└── main.ts           # Electron 메인 프로세스 (OS 제어)
```

---

## ⚙️ 실행 및 빌드 가이드

### 1. 환경 설치
```bash
npm install
```

### 2. 개발 모드 실행
- **Web 게임 실행**: `npm run dev`
- **데스크탑 앱 실행**: `npm run electron:dev`

### 3. 빌드 및 배포
- **웹 호스팅 배포**: `npm run deploy` (GitHub Pages)
- **데스크탑 앱 패키징**: `npm run dist`

---

## 🧭 게임 개발 가이드

Phaser 씬 관리, 의존성 주입, 멀티플레이 연동 등에 대한 상세 가이드는 [PHASER_GUIDE.md](./PHASER_GUIDE.md)를 참조하세요.


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

## 🛡 Audit Logger & Safety 가이드

이 프로젝트는 안정성을 위해 시스템의 주요 동작을 기록하는 `AuditLogger`를 운영[LOGGER_GUIDE.md](./src/core/logger/LOGGER_GUIDE.md)

---

## 🌐 다국어(i18n) 설정 가이드

플랫폼 공용 언어 팩 관리 및 렌더러 다국어 적용 가이드 [I18N_GUIDE.md](./src/shared/i18n/I18N_GUIDE.md)

---

## 💾 Persistence Service 가이드

이 서비스는 애플리케이션의 설정, 게임 진행도, 사용자 데이터 등을 **암호화하여 로컬 디스크에 영구 저장**하는 기능을 제공 [PERSISTENCE_GUIDE.md](./src/core/persistence/PERSISTENCE_GUIDE.md)

---

## 🔐 Security & Compression 가이드 (Shared)

AES-256-GCM, RSA-OAEP 암호화 및 멀티 알고리즘 데이터 압축 인프라 [SECURITY_GUIDE.md](./src/shared/security/SECURITY_GUIDE.md)

---

## 📊 System Info Service 가이드

호스트 OS의 리소스 사용량(CPU, 메모리)과 앱의 실행 상태 정보를 수집 [SYSTEM_INFO_GUIDE.md](./src/core/system/SYSTEM_INFO_GUIDE.md)

---

## 🖥 Main Process 개발 가이드

Electron 메인 프로세스(`src/main.ts`)의 구조와 IPC 통신 작성 표준 가이드 [MAIN_PROCESS_GUIDE.md](./src/core/MAIN_PROCESS_GUIDE.md)

---

## 📜 변경 이력 (Changelog)

프로젝트의 상세한 개발 단계, 실행 명령어, 핵심 코드 변경 내역은 [CHANGELOG.md](./changelogs/CHANGELOG.md)
