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

---

## 🧭 개발 중 주기적으로 관리해야 할 파일 (Key Maintenance Files)

1.  **`src/core/di/container.ts`**: 새로운 `Service`나 `Controller` 클래스를 등록하여 주입 체계를 완성합니다.
2.  **`src/main.ts` & `src/preload.ts`**: OS 전용 기능 호출을 위한 IPC 통신을 정의합니다.
3.  **`package.json`**: 라이브러리 추가 및 앱 배포 설정을 관리합니다.
4.  **`.env` & `.env.example`**: 환경 변수 및 보안 키를 관리합니다.

---

## 📜 변경 이력 (Changelog)

프로젝트의 상세한 개발 단계, 실행 명령어, 핵심 코드 변경 내역은 [CHANGELOG.md](./CHANGELOG.md)에서 확인하실 수 있습니다.
