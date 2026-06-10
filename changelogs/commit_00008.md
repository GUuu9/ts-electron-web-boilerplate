# 🚀 커밋 상세: COMMIT_00008

매크로 기능 고도화 및 네트워크 상태 관리 시스템 개선.

### 🚀 주요 업데이트
- **매크로 UI/UX 개선**: 
    - 매크로 빌더 디자인을 프로젝트 테마에 맞춰 현대적이고 컴팩트하게 개편.
    - 실행 단계 시각화(하이라이트), 드래그 앤 드롭 액션 순서 변경 기능 추가.
- **매크로 제어 고도화**:
    - **전역 단축키**: F5(시작), F6(중지), F2(좌표 추출) 전역 단축키 도입.
    - **파일 시스템 연동**: Save/Load 시 파일 대화상자를 통해 위치를 직접 지정하도록 개선.
- **매크로 기능 확장**:
    - **액션 다양화**: 우클릭, 더블 클릭, 드래그, 스크롤, 조합키 입력 등 지원.
    - **이미지 검색(Vision)**: 화면 내 이미지 찾기 기능 구현 및 타임아웃/성공-실패 동작 조건부 설정.
    - **파라미터 세분화**: 각 액션별 입력폼 최적화 및 사용자 메모 입력 기능.
- **네트워크 기능 오류 수정**:
    - `BaseState` 기반 상태 관리 도입으로 발생한 Socket/TCP UI 동기화 오류 해결. 
    - 상태 변경 통지 패턴을 적용하여 UI 상태 자동 갱신 로직 완성.

### 🛠 수정된 파일
- `src/renderer/scenes/macro/*` (View, ViewModel, Service, Models 전체 개편)
- `src/main/features/automation/*` (Server, Core, Bridge)
- `src/main/features/vision/*` (Server, Core, Bridge)
- `src/main/features/os/shortcut/shortcut.manager.ts`
- `src/renderer/scenes/network/socket/*`
- `src/renderer/scenes/network/tcp/*`
- `build/entitlements.mac.plist`
