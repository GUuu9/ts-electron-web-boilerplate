# 🧠 Behavior Tree AI 상세 가이드

본 프로젝트는 복잡한 시스템의 의사결정 로직을 계층적으로 관리하고 확장하기 위해 **행동 트리(Behavior Tree, BT)** 시스템을 도입했습니다. 상태 기계(FSM)와 달리 노드 기반의 모듈러 구조를 통해 복잡한 로직을 손쉽게 수정 및 조합할 수 있는 것이 특징입니다.

---

## 1. 행동 트리(BT)란?
행동 트리는 **부모 노드**와 **자식 노드**로 이루어진 계층 구조입니다. 루트(Root) 노드에서 시작하여 매 프레임(또는 주기)마다 트리를 순회하며 노드의 **상태(Success, Failure, Running)**를 평가합니다.

### 상태 정의
- **Success (성공)**: 액션이 의도한 결과를 도출함.
- **Failure (실패)**: 액션이 수행 불가능하거나 실패함.
- **Running (실행 중)**: 액션이 아직 완료되지 않아 현재 진행 중임.

---

## 2. 노드 타입 및 구조

### A. Composite 노드 (논리 제어)
하위 노드들의 실행 흐름을 제어합니다.
- **Sequence (AND)**: 자식 노드가 하나라도 `Failure`이면 즉시 `Failure`를 반환. 모두 `Success`여야 전체가 `Success`를 반환.
- **Selector (OR)**: 자식 노드가 하나라도 `Success`이면 즉시 `Success`를 반환. 모두 `Failure`일 때만 전체가 `Failure`를 반환.

### B. Decorator 노드 (조건/상태 장식)
하위 노드의 실행을 제어하거나 결과를 변형합니다.
- **Inverter**: 결과를 반전시킴 (Success ↔ Failure).
- **Repeater**: 하위 노드를 반복 실행함.
- **Succeeder**: 항상 Success를 반환 (조건 체크용).

### C. Action 노드 (실제 실행)
트리의 가장 말단(Leaf)에 위치하며, 실제로 OS 자원을 제어하거나 데이터를 변경하는 비즈니스 로직을 수행합니다.

---

## 3. 핵심 아키텍처 (`src/core/ai/`)

- **Blackboard (공용 상태 판)**: 트리의 모든 노드가 공유하는 상태 저장소입니다. 데이터의 입출력, 현재 장치 상태, 타이머 값 등을 보관합니다.
- **Base Node**: 모든 노드가 상속받는 기본 클래스입니다. `tick()` 메서드를 통해 로직이 실행됩니다.
- **BehaviorTree 클래스**: 루트 노드를 관리하고 엔진의 틱(Tick)을 관리하는 메인 클래스입니다.

---

## 4. 구현 및 확장 가이드

### 1단계: Action 생성 (`src/features/ai/actions/`)
`BaseAction`을 상속받아 `run()` 메서드를 구현합니다.
```typescript
class MyCustomAction extends BaseAction {
  run(blackboard: Blackboard): NodeStatus {
    // 여기에 비즈니스 로직 작성
    return NodeStatus.Success;
  }
}
```

### 2단계: 트리 조합 (`src/features/ai/trees/`)
기존의 `Composite`와 `Action`을 조합하여 트리 파일을 정의합니다.
```typescript
const myTree = new Selector([
  new Sequence([
    new IsDeviceConnectedAction(),
    new StartDataMonitoringAction()
  ]),
  new FallbackAction()
]);
```

### 3단계: 엔진 등록 (`src/features/ai/ai.core.ts`)
생성된 트리를 `AI Core`에 등록하여 주기적으로 `tick()`이 호출되도록 설정합니다.

---

## 5. 설계 원칙 및 팁
- **단일 책임 원칙(SRP)**: 하나의 액션 노드는 반드시 하나의 기능만 수행해야 합니다.
- **상태의 독립성**: 액션은 가능한 외부 상태에 의존하지 말고 오직 `Blackboard`의 값만을 참조하십시오.
- **재사용성**: 잦은 논리 조합은 Decorator로 만들어 재사용성을 높이십시오.
- **디버깅**: `window.electronAPI.ai.getStatus()`를 활용해 실시간으로 Blackboard 상태를 렌더러에서 모니터링하십시오.
