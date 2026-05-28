import { BaseNode, Blackboard, NodeStatus } from './base.js';

/**
 * 행동 트리 전체를 관리하고 실행(Tick)하는 컨트롤러 클래스입니다.
 */
export class BehaviorTree {
  constructor(
    private root: BaseNode,
    private blackboard: Blackboard = new Blackboard()
  ) {}

  // 트리를 한 단계 실행합니다.
  tick(): NodeStatus {
    return this.root.tick(this.blackboard);
  }

  // 공용 저장소에 접근합니다.
  getBlackboard(): Blackboard {
    return this.blackboard;
  }
}
