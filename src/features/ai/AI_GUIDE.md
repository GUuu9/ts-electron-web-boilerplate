# 🧠 Behavior Tree AI 개발 가이드

이 프로젝트는 복잡한 의사결정 로직을 관리하기 위해 **Behavior Tree(BT)** 기반의 모듈러 AI 시스템을 채택하고 있습니다.

## 🏗 설계 구조

1.  **Engine (`src/core/ai/`)**: AI 엔진의 핵심 인프라입니다.
    - `base.ts`: `Blackboard`, `Node`, `CompositeNode` 등 기본 추상 클래스 정의
    - `composites.ts`: `Selector`(OR), `Sequence`(AND) 등 흐름 제어 노드
    - `tree.ts`: 실행 관리(`BehaviorTree`)
2.  **Actions (`src/features/ai/actions/`)**: 재사용 가능한 범용 액션 노드 라이브러리입니다.
3.  **Trees (`src/features/ai/trees/`)**: 특정 비즈니스 도메인(Network, Device 등)에 맞는 AI 로직을 조합하는 트리 정의 파일들입니다.

## 🛠 새로운 AI 기능 추가 절차

1.  **범용 액션 노드 활용**: 필요한 액션이 `generic.actions.ts`에 없다면 `actions/` 폴더에 새로 생성합니다.
2.  **트리 정의 생성**: `trees/` 폴더에 `[name].tree.ts` 파일을 만들고, `Sequence` 또는 `Selector` 노드를 조합하여 트리를 구성합니다.
3.  **Core Feature 등록**: `src/features/ai/ai.core.ts`의 `init()` 메서드에서 트리 인스턴스를 생성하고 관리 목록에 추가합니다.

## 💾 상태 공유 (Blackboard)
각 AI 엔진은 독립적인 `Blackboard`를 가집니다. `blackboard.set(key, value)`와 `blackboard.get(key)`를 통해 트리 내부에서 상태를 공유하며, Renderer 프로세스에서 `window.electronAPI.ai.getStatus()`를 통해 실시간 모니터링이 가능합니다.

---

## ⚠️ 주의 사항
- **쿨타임 관리**: 알림이나 네트워크 요청 등 반복 호출이 예상되는 액션은 `Blackboard`의 타임스탬프를 갱신하여 재실행 주기를 조절해야 합니다.
- **주기적 실행**: `ai.core.ts`에서 각 트리별로 적절한 실행 주기(setInterval)를 설정하십시오.
