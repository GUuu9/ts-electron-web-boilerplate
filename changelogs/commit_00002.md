# 🚀 COMMIT_00002: AI 및 물리기반 슈팅 시스템 구현

## 🚀 주요 업데이트
### 1. 행동 트리(Behavior Tree) AI 시스템 도입
- `src/shared/core/ai/`를 통해 프레임워크 기초(Blackboard, BaseNode, BehaviorTree) 구축.
- 백엔드(Main) 프로세스에서 프론트엔드(Renderer) 프로세스로 AI 엔진 이전 완료.
- SRP 원칙을 준수하는 `AIRunner` 클래스 구현 (`requestAnimationFrame` 기반).

### 2. Phaser 물리기반 슈팅 시스템 구현
- Phaser 물리 엔진(Arcade)을 사용하여 투사체 발사 및 충돌 로직 구현.
- 슈팅 AI(`shooter.tree.ts`) 구현: 타겟 생성, 계산, 발사 루프 구성.
- 지능형 조준: 타겟과의 거리에 따른 파워 조정 및 오차 보정(Bias) 학습 메모리 시스템 구현.

### 3. 멀티 플랫폼(Web/Electron) 방어 코드
- 모든 하드웨어 리포지토리(`Serial`, `Os`, `System`, `Persistence`, `Security`, `File`, `Media`)에 `window.electronAPI` 존재 여부를 확인하는 방어 코드 추가.

## 🛠 수정된 파일
- `src/shared/core/ai/*`
- `src/renderer/core/ai/*`
- `src/renderer/features/ai/*`
- `src/renderer/core/di/registry.ts`
- `src/renderer/main.ts`
- `vite.config.ts`
- `src/renderer/data/**/*.repository.ts`
