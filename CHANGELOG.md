# 📜 변경 이력 (Changelog)

이 프로젝트의 모든 개발 단계와 주요 변경 사항을 기록합니다.

---

## 📅 2026년 4월 16일 (목)

### 1. 코어 대시보드(Core Dashboard) 구현
- **UI/UX 개선**: Lucide 아이콘과 현대적인 CSS(Glassmorphism)를 적용한 대시보드 메인 페이지 구현.
- **동적 라우팅**: 별도의 프레임워크 없이 Vanilla JS로 탭 전환 및 서브 페이지 이동 로직(`UIRouterService`) 구축.
- **실시간 로깅**: 테스트 진행 상황과 결과를 시각적으로 확인할 수 있는 전용 로그 패널(`UILoggerService`) 추가.

### 2. 렌더러 아키텍처(Renderer Architecture) 정립
- **계층형 구조 적용**: `src/renderer/src` 폴더를 `core`(인프라)와 `features`(기능 컨트롤러)로 분리하여 메인 아키텍처와 통일성 확보.
- **의존성 주입(DI)**: 렌더러 전용 컨트롤러들이 필요한 서비스를 생성자로 주입받는 패턴 적용.

### 3. 네트워크 IPC 브릿지(Network IPC Bridge) 고도화
- **TCP/UDP 연동**: Node.js 전용인 `net`, `dgram` 모듈을 메인 프로세스에서 실행하고, 렌더러와 IPC(`preload.ts`)를 통해 양방향 통신 구현.
- **UDP Bind 지원**: 특정 포트에서 패킷을 수신 대기할 수 있는 `bind` 기능을 추가하고 소켓 재생성 로직을 통해 "Already bound" 에러 해결.
- **Socket.io 확장**: JSON 객체 전송(Auto-parsing) 및 특정 이벤트 횟수 제한 수신(N회 리스너 해제) 기능 구현.

### 4. macOS 빌드 권한(Permissions) 최적화
- **샌드박스 대응**: `entitlements.mac.plist`에 블루투스, USB, 오디오, JIT 허용 권한을 추가하여 빌드 후 실행 파일에서의 하드웨어 접근 차단 문제 해결.
- **권한 설명 추가**: `package.json`의 `extendInfo` 설정을 통해 macOS 시스템 권한 팝업에 표시될 목적 문구(Usage Description) 정의.

### 5. 통합 장치 선택 시스템 (Unified Device Picker) 구축
- **커스텀 모달 UI**: Electron이 기본 제공하지 않는 장치 선택창을 대시보드 내 모달 레이어로 직접 구현.
- **통합 브릿지**: 블루투스, USB, HID 장치 탐색 이벤트를 메인 프로세스에서 가로채어 렌더러의 단일 모달 UI로 연동하는 IPC 체계 구축.
- **유연한 레이아웃**: 긴 장치 이름도 줄바꿈을 통해 모두 확인할 수 있도록 리스트 디자인 개선.

### 6. 미디어 장치(Media Devices) 제어 고도화
- **장치별 테스트 시나리오**:
    - **마이크**: 실시간 음압(Volume Level) 분석 및 시각화.
    - **카메라**: 실시간 비디오 프리뷰 모달 팝업.
    - **스피커**: 특정 출력 장치를 통한 테스트 비프음(Beep) 재생.
- **설정 유지(Persistence)**: `localStorage`를 활용하여 사용자가 선택한 기본 마이크/카메라/스피커 정보를 저장하고 🌟 아이콘으로 강조 표시.

### 8. 프로젝트 구조 표준화 (Path Standardization)
- **경로 별칭 제거**: `tsconfig` 및 `vite.config`에서 `@/` 별칭 설정을 삭제하여 표준 모듈 시스템과의 호환성 강화.
- **상대 경로 전환**: 소스 코드 내 모든 임포트 문을 표준 상대 경로(`./`, `../`)로 일괄 변환 및 가이드 문서 업데이트.

### 9. 아키텍처 안정화 (Architecture Hardening)
- **DI 컨테이너 이원화**: `container.ts`를 `container.main.ts`와 `container.renderer.ts`로 분리하여 플랫폼 의존성(Node.js vs Browser) 문제를 근본적으로 해결.
- **배럴 파일 제거**: `src/core/` 하위의 모든 `index.ts`를 제거하고 명시적 임포트(Explicit Import) 방식으로 전환하여 의존성 순환 및 불필요한 모듈 로딩 방지.
- **모듈 로드 에러 해결**: 렌더러가 Node.js 전용 모듈(`net`, `dgram`)을 참조하던 문제를 완벽히 차단하여 빌드 후 실행 파일 안정성 확보.

### 10. Audit Logger 서비스 구현
- **AuditLogger 도입**: 기존 로깅 서비스를 대체하는 하드웨어 제어 및 동작 기록 전용 서비스 구현.
- **파일 기록**: 하드웨어 제어 이력 및 주요 동작을 `audit.log` 파일에 기록하여 추적성 확보.

---

## 📅 2026년 4월 15일 (수)

### 1. 프로젝트 초기화 및 환경 구축
- **실행 명령어**:
  ```bash
  npm init -y
  npm install --save-dev typescript electron electron-builder vite vitest @types/node
  npx tsc --init
  mkdir -p src/core/database src/core/di src/core/network src/core/route src/features src/shared src/renderer/public src/renderer/src
  ```

### 2. Node.js 런타임 업그레이드 및 보안 패치
- **실행 명령어**:
  ```bash
  nvm install 22 && nvm use 22
  npm install --save-dev typescript@latest electron@latest vite@latest
  npm audit fix
  ```
- **변경 사양**: Node.js v20 -> **v22.22.2 (LTS)**

### 3. TypeScript 설정 최적화 (.json)
- **수정 파일**: `tsconfig.electron.json`
- **핵심 코드**:
  ```json
  // moduleResolution 에러 해결 및 최신 Node 환경 반영
  "module": "NodeNext",
  "moduleResolution": "NodeNext",
  ```

### 4. 의존성 주입(DI) 시스템 구현
- **수정 파일**: `src/core/di/container.ts`, `src/core/di/index.ts`
- **핵심 코드**:
  ```typescript
  // 싱글톤 컨테이너 구현
  export class DIContainer {
    private constructor() {
      const calcService = new CalcService();
      this.services.set('CalcService', calcService);
      this.services.set('CalcController', new CalcController(calcService));
    }
  }
  // 배럴 내보내기 (index.ts)
  export * from './container';
  ```

### 5. 환경 변수 및 보안 관리 구축
- **실행 명령어**: `npm install dotenv`
- **수정 파일**: `src/main.ts`, `.env`, `.gitignore`
- **핵심 코드**:
  ```typescript
  // main.ts 상단에 환경 변수 로드 추가
  import * as dotenv from 'dotenv';
  dotenv.config();
  ```

### 6. 멀티 플랫폼 빌드 명령어 고도화
- **수정 파일**: `package.json`
- **핵심 코드**:
  ```json
  "scripts": {
    "dist": "npm run build:web && npm run build:electron && electron-builder --mac --win --linux"
  }
  ```

### 7. 네트워크 인프라(Network Infra) 구축
- **실행 명령어**: `npm install axios socket.io-client`
- **수정 파일**: `src/core/network/` 내부 전체 및 `src/core/di/container.ts`
- **구현 내용**:
    - **HTTP(HttpClient)**: `axios`를 활용한 REST API 공통 클라이언트 구현.
    - **TCP(TcpClient)**: Node.js `net` 모듈을 래핑하여 안정적인 스트림 통신 지원.
    - **UDP(UdpClient)**: Node.js `dgram` 모듈을 활용한 빠른 패킷 통신 구현.
    - **Socket.io(SocketClient)**: 실시간 양방향 이벤트를 위한 소켓 클라이언트 구현.
    - **DI 등록**: 모든 네트워크 클라이언트를 싱글톤으로 DI 컨테이너에 등록 완료.

### 8. OS별 네트워크 권한 설정 (Permissions)
- **수정 파일**: `package.json`, `build/entitlements.mac.plist` 등
- **구현 내용**:
    - **macOS Sandbox**: `entitlements.mac.plist` 설정을 통해 외부 통신(Client) 및 서버 기능(Server) 권한 허용.
    - **빌드 자동화**: `electron-builder` 설정에 권한 파일들을 연결하여 배포 패키지 생성 시 자동 적용.
    - **권한 가이드**: `PERMISSION_GUIDE.md`를 생성하여 Mac, Win, Linux 환경별 네트워크 주의 사항 상세 기록.

### 9. 코어 기능 호환성 관리 (Web vs Desktop)
- **수정 파일**: `README.md`, `src/core/di/container.ts`
- **구현 내용**:
    - **호환성 문서화**: `README.md`에 각 코어 기능별 운영체제 호환성 및 사용 패키지 정보를 상세히 기록.
    - **조건부 등록(Conditional Registration)**: `DIContainer`에서 `isElectron` 여부를 감지하여, 웹 브라우저에서는 Node.js 전용 기능(`TcpClient`, `UdpClient`)이 등록되지 않도록 방어 로직 구현.

### 10. 프로젝트 ESM 전환 (Vite 6 호환성 강화)
- **수정 파일**: `package.json`, `src/main.ts`
- **구현 내용**:
    - **ESM 선언**: `package.json`에 `"type": "module"`을 추가하여 프로젝트를 현대적인 ESM 환경으로 전환.
    - **Vite 6 호환**: Vite Node API의 CJS 지원 중단(Deprecated) 경고를 해결하기 위해 `vite.config.ts`를 ESM 표준으로 재작성.
    - **파일 접근 제어**: `server.fs.allow` 설정을 통해 렌더러 외부 폴더(`shared`, `features`)에 대한 접근 권한 허용.
    - **경로 별칭(@) 적용**: 프로젝트 전반(`core`, `shared`, `features`, `renderer`)의 임포트 경로를 `@/` 별칭 기반으로 통일하여 가독성 및 이식성 향상.
    - **환경 인식 오류 해결**: `vite.config.ts`의 `process.env` 덮어쓰기 설정을 제거하고, `src/main.ts`의 `sandbox: false` 설정을 통해 Electron 창 안에서 `window.electronAPI`가 정상적으로 주입되도록 수정.
    - **타입 정의 최적화**: `tsconfig`에 `"types": ["node"]`를 추가하여 ESM 환경에서도 `process` 등 Node.js 전역 변수를 완벽하게 인식하도록 개선.
    - **빌드 경로 오류 해결**: `tsconfig.electron.json`에 별칭(@) 경로 설정을 추가하고, `NodeNext` 표준에 따라 모든 로컬 파일 임포트 시 **`.js` 확장자**를 명시하여 최종 빌드 오류 해결.
    - **장치 제어 타입 안정성**: `@types/web-bluetooth`, `@types/w3c-web-usb` 도입 및 `tsconfig.electron.json`에 `DOM` 라이브러리를 추가하여 빌드 에러 해결.
    - **런타임 방어**: `DIContainer`에서 `navigator` 유무를 감지하여, 메인 프로세스(Node.js) 실행 시 브라우저 전용 서비스로 인한 런타임 에러 방지.
    - **Electron 권한 타입 수정**: 메인 프로세스에서 권한 비교 시 문자열 캐스팅을 적용하여 타입 불일치 에러 해결.
    - **문서 보강**: `README.md`에서 누락된 빌드 및 배포(`npm run dist`) 가이드 섹션 복구.

### 11. 장치 제어 인프라(Device Control) 구축
- **수정 파일**: `src/core/device/` 내부 전체, `src/main.ts`, `src/core/di/container.ts`
- **구현 내용**:
    - **블루투스(BluetoothService)**: Web Bluetooth API를 활용한 장치 검색 및 연결 구현.
    - **USB/HID(UsbService)**: WebUSB, WebHID, Gamepad API를 활용한 외장 장치 제어 기능 구축.
    - **미디어(MediaService)**: 마이크, 헤드셋 등 오디오 장치 목록 확인 및 스트림 획득 서비스 구현.
    - **Electron 권한 설정**: 메인 프로세스(`src/main.ts`)에서 블루투스 장치 선택 및 USB 접근 권한 자동 부여 로직 추가.
    - **DI 등록**: 모든 장치 서비스를 싱글톤으로 DI 컨테이너에 등록 완료.

### 12. 애플리케이션 표시명 및 아이콘 설정
- **수정 파일**: `package.json`, `src/renderer/index.html`
- **구현 내용**:
    - **표시명(productName)**: 앱 설치 이름 및 창 제목을 "My Cross Platform App"으로 변경.
    - **아이콘 기반 마련**: 데스크탑 빌드용 `build/` 리소스와 웹용 `favicon.ico` 경로 설정 완료.
