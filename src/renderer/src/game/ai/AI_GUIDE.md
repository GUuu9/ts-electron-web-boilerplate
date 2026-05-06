# 🤖 Autonomous AI Guide (Behavior Tree)

이 프로젝트는 **Behavior Tree (행동 트리)** 아키텍처를 사용하여 스스로 사고하고 상황을 판단하는 자율형 AI 에이전트를 구현합니다.

---

## 🏗 아키텍처 구조 (Architecture)

AI 시스템은 `src/renderer/src/game/ai` 폴더 내에 위치하며, 핵심 엔진과 구체적인 행동 로직으로 분리되어 있습니다.

### 1. 핵심 엔진 (Core Engine) - `ai/core/`
- **`Node`**: 모든 AI 노드의 추상 기반 클래스입니다. `tick()` 메서드를 호출하여 상태를 반환합니다.
    - `SUCCESS`: 행동 성공 또는 조건 충족
    - `FAILURE`: 행동 실패 또는 조건 미충족
    - `RUNNING`: 행동이 진행 중 (애니메이션 이동 등)
- **`Composite`**: 여러 자식 노드를 관리하는 복합 노드입니다.
    - **`Selector`**: 자식 노드 중 하나라도 성공할 때까지 순차 실행 (우선순위 판단).
    - **`Sequence`**: 모든 자식 노드가 성공할 때까지 순차 실행 (절차적 행동).
- **`Blackboard`**: AI 에이전트와 노드 간에 데이터(예: 타겟 위치, 자신의 상태)를 공유하는 메모리 공간입니다.

### 2. 행동 및 판단 노드 (Nodes) - `ai/nodes/`
- **Condition Nodes**: `DistanceCondition`과 같이 현재 상황을 체크하여 `SUCCESS` 또는 `FAILURE`를 반환합니다.
- **Action Nodes**: `WanderAction`, `FollowTargetAction`과 같이 실제로 캐릭터를 움직이거나 상태를 변경합니다.

---

## 🚀 사용 방법 (Usage)

### 1. 새로운 행동 노드 추가하기
새로운 행동(예: 공격)을 만들려면 `Node` 클래스를 상속받아 구현합니다.

```typescript
import { Node, NodeStatus } from '../core/Node.js';

export class AttackAction extends Node {
  public tick(): NodeStatus {
    // 공격 로직 구현
    console.log('Attacking!');
    return NodeStatus.SUCCESS;
  }
}
```

### 2. AI 에이전트 구성하기
`NpcAgent` 클래스에서 행동 트리를 조립합니다.

```typescript
this.rootNode = new Selector([
  new Sequence([
    new DistanceCondition(this.blackboard, 150), // 1. 타겟이 가까운가?
    new AttackAction()                          // 2. 가깝다면 공격!
  ]),
  new WanderAction(this.blackboard)             // 3. 아니라면 배회하기.
]);
```

### 3. 메인 씬 통합
`MainScene`의 업데이트 루프에서 AI를 실행합니다. Phaser 4 환경에서는 이벤트 기반 업데이트를 권장합니다.

```typescript
// create() 단계
this.events.on('update', () => {
  if (this.npc) this.npc.update();
});
```

---

## 🧭 개발 원칙
1. **관심사 분리**: AI 로직은 `ai/` 폴더 내에서 관리하며, `MainScene`은 AI의 `update()`만 호출합니다.
2. **데이터 공유**: 모든 노드는 직접 소통하지 않고 `Blackboard`를 통해서만 데이터를 읽고 씁니다.
3. **우선순위 관리**: `Selector`의 자식 노드 순서가 곧 AI의 우선순위입니다. (먼저 등록된 노드가 우선권 가짐)

---

## 📜 관련 파일
- `src/renderer/src/game/ai/core/`: BT 핵심 엔진
- `src/renderer/src/game/ai/nodes/`: 개별 행동 및 조건 로직
- `src/renderer/src/game/NpcAgent.ts`: AI가 탑재된 NPC 클래스
