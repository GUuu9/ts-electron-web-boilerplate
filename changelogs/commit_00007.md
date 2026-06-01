# Commit_00007: UDP 기능 확장 및 로그 기능 추가

기존의 단순한 UDP 기능을 TCP 기능과 동등한 수준으로 확장하여, 포트 바인딩/해제 및 실시간 데이터 송수신을 로그와 함께 확인할 수 있도록 구현했습니다.

## 🚀 주요 업데이트

### 1. 백엔드 (Main Process)
- **UdpService**: `dgram` 모듈을 사용하여 바인딩 및 데이터 발신 기능을 안정화하고, 상태를 관리하도록 리팩토링했습니다.
- **UdpCoreModule**: IPC 핸들러를 확장하여 렌더러와 UDP 이벤트(데이터 수신 등)를 실시간으로 주고받을 수 있도록 구성했습니다.

### 2. 프론트엔드 (Renderer Process)
- **UdpRepository**: 서버/클라이언트 기능 분리에 맞춰 브릿지 연동 메서드를 체계화하고 방어적 프로그래밍을 적용했습니다.
- **UdpViewModel**: 데이터 수신 시 타임스탬프와 함께 로그를 생성하고 상태를 관리하는 로직을 구현했습니다.
- **UdpView & Binder**: 포트 바인딩, 메시지 전송 UI를 재구성하고 하단에 실시간 로그 창을 추가했습니다.

### 3. 통신 브릿지 (Bridge)
- **UdpBridge**: 렌더러가 UDP 통신을 완벽히 제어할 수 있도록 인터페이스를 정의했습니다.

## 🛠 수정된 파일
- `src/main/features/network/udp/udp.server.ts`
- `src/main/features/network/udp/udp.core.ts`
- `src/main/features/network/udp/udp.bridge.ts`
- `src/renderer/data/network/udp/udp.repository.ts`
- `src/renderer/features/network/udp/udp.viewmodel.ts`
- `src/renderer/features/network/udp/udp.view.ts`
- `changelogs/CHANGELOG.md`
- `changelogs/commit_00007.md`
