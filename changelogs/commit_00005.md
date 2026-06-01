# Commit_00005: Socket 동적 이벤트 수신 기능 추가 및 방어적 프로그래밍 적용

이 커밋에서는 Socket 서버와 클라이언트 모두에서 사용자가 입력한 이벤트 명으로 데이터를 수신할 수 있는 기능을 구현하고, 웹 환경에서의 안정성을 위한 방어적 프로그래밍을 강화했습니다.

## 🚀 주요 업데이트

### 1. 백엔드 (Main Process)
- **SocketServer**: 특정 이벤트를 모든 클라이언트 소켓에서 수신할 수 있도록 `listenEvent` 메서드를 추가했습니다. 새로운 클라이언트가 접속할 때도 기존에 등록된 리스너가 자동으로 적용됩니다.
- **SocketCore**: `socket:listenEvent` IPC 핸들러를 추가하여 렌더러의 요청을 처리하고, 수신된 데이터를 `socket:onServerReceived` 이벤트를 통해 렌더러로 전달합니다.

### 2. 프론트엔드 (Renderer Process)
- **SocketRepository**: 백엔드의 새로운 IPC 기능을 호출하고 이벤트를 구독하기 위한 메서드를 추가했습니다. 웹 환경에서도 오류 없이 동작하도록 `electronAPI` 존재 여부를 확인하는 방어적 프로그래밍을 적용했습니다.
- **SocketViewModel**: 서버와 클라이언트 각각에 대해 동적 이벤트 구독 로직을 구현했습니다. 서버 수신 로그와 클라이언트 수신 로그를 구분하여 UI에 표시하며, 데스크톱 환경일 때만 서버 리스너를 등록하도록 수정했습니다.
- **SocketView & Binder**: 사용자가 이벤트 명을 입력하고 구독 버튼을 누를 수 있도록 UI 요소를 추가하고 이벤트를 바인딩했습니다.

### 3. 브릿지 (Bridge)
- **SocketBridge**: 렌더러가 백엔드 서버의 수신 이벤트를 구독하고 메시지를 받을 수 있도록 인터페이스를 확장했습니다.

### 4. 방어적 프로그래밍 (Robustness)
- `SocketRepository`, `TcpRepository`, `UdpRepository` 등 데스크톱 전용 API를 사용하는 모든 리포지토리에 `electronAPI` 체크 로직을 강화하여 웹 환경에서의 런타임 오류를 방지했습니다.

## 🛠 수정된 파일
- `src/main/features/network/socket/socket.server.ts`
- `src/main/features/network/socket/socket.core.ts`
- `src/main/features/network/socket/socket.bridge.ts`
- `src/renderer/data/network/socket/socket.repository.ts`
- `src/renderer/data/network/tcp/tcp.repository.ts`
- `src/renderer/data/network/udp/udp.repository.ts`
- `src/renderer/features/network/socket/socket.viewmodel.ts`
- `src/renderer/features/network/socket/socket.view.ts`
- `changelogs/CHANGELOG.md`
- `changelogs/commit_00005.md`
