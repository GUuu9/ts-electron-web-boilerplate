# 🚀 주요 업데이트 (Socket 기능 고도화)

Socket 통신 기능을 확장하여 서버 활성화 및 클라이언트 연결 기능을 MVVM 패턴에 따라 구현하였습니다.

1. **Backend 구현**:
   - `src/main/features/network/socket/`: `socket.server.ts`, `socket.core.ts`, `socket.bridge.ts` 생성.
   - `socket.io`를 사용한 서버 및 IPC 핸들러 등록.
2. **Preload/DI 등록**:
   - `src/main/preload.ts`: `socketBridge` 노출.
   - `src/main/core/di/registry.ts`: `SocketCore` 의존성 주입.
3. **Frontend 구현**:
   - `src/renderer/data/network/socket/socket.repository.ts`: 클라이언트/서버 통신 통합 리포지토리.
   - `src/renderer/features/network/socket/socket.viewmodel.ts`: UI 로직 및 상태 관리(서버 상태, 로그) 구현.
   - `src/renderer/features/network/socket/socket.view.ts`: 서버/클라이언트 UI 및 로그 영역 구현.
   - `src/renderer/features/network/socket/socket.binder.ts` (View 내부 포함): UI 이벤트 바인딩.

## 🛠 수정 및 생성된 파일
- `src/main/features/network/socket/` (전체 파일)
- `src/main/preload.ts`
- `src/main/core/di/registry.ts`
- `src/renderer/data/network/socket/socket.repository.ts`
- `src/renderer/features/network/socket/` (전체 파일)
- `src/renderer/core/di/registry.ts`
