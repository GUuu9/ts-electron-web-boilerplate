# Commit_00006: TCP Server/Client 확장 및 로그 기능 추가

이 커밋에서는 기존의 단순한 TCP 서버 기능을 확장하여 서버와 클라이언트 역할을 모두 수행할 수 있도록 개선하고, 주고받는 데이터를 실시간으로 확인할 수 있는 로그 기능을 추가했습니다.

## 🚀 주요 업데이트

### 1. 백엔드 (Main Process)
- **TcpService**: `net` 모듈을 사용하여 다중 접속 가능한 서버와 독립적인 클라이언트 로직을 통합 관리하도록 구현했습니다.
- **TcpCoreModule**: 서버 및 클라이언트의 연결 상태와 데이터 송수신을 처리하는 IPC 핸들러를 추가하고, 모든 이벤트를 렌더러로 전달하도록 구성했습니다.

### 2. 프론트엔드 (Renderer Process)
- **TcpRepository**: 서버 시작/중지, 브로드캐스트, 클라이언트 연결/해제, 데이터 송수신 등 확장된 기능을 지원하도록 브릿지 연동을 강화했습니다.
- **TcpViewModel**: 서버와 클라이언트의 상태를 통합 관리하고, 발생한 모든 이벤트를 타임스탬프와 함께 로그로 변환하는 비즈니스 로직을 구현했습니다.
- **TcpView & Binder**: 서버 제어 영역, 클라이언트 제어 영역, 그리고 하단의 실시간 로그 출력 영역을 포함하는 새로운 UI 레이아웃을 적용했습니다.

### 3. 통신 브릿지 (Bridge)
- **TcpBridge**: 서버 및 클라이언트의 모든 기능과 비동기 이벤트를 렌더러에 노출하기 위한 인터페이스를 정의했습니다.

## 🛠 수정된 파일
- `src/main/features/network/tcp/tcp.server.ts`
- `src/main/features/network/tcp/tcp.core.ts`
- `src/main/features/network/tcp/tcp.bridge.ts`
- `src/renderer/data/network/tcp/tcp.repository.ts`
- `src/renderer/features/network/tcp/tcp.viewmodel.ts`
- `src/renderer/features/network/tcp/tcp.view.ts`
- `changelogs/CHANGELOG.md`
- `changelogs/commit_00006.md`
