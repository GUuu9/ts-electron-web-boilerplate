import { BaseNode, Blackboard, NodeStatus } from './base.js';

/**
 * 여러 하위 노드를 조합하여 논리 흐름을 제어하는 복합 노드입니다.
 */
export abstract class CompositeNode extends BaseNode {
  constructor(protected children: BaseNode[]) {
    super();
  }
}

/**
 * 모든 자식 노드가 Success를 반환해야 성공하는 노드입니다.
 */
export class SequenceNode extends CompositeNode {
  tick(blackboard: Blackboard): NodeStatus {
    for (const child of this.children) {
      const status = child.tick(blackboard);
      if (status !== NodeStatus.Success) {
        return status;
      }
    }
    return NodeStatus.Success;
  }
}

/**
 * 자식 노드 중 하나라도 Success를 반환하면 성공하는 노드입니다.
 */
export class SelectorNode extends CompositeNode {
  tick(blackboard: Blackboard): NodeStatus {
    for (const child of this.children) {
      const status = child.tick(blackboard);
      if (status !== NodeStatus.Failure) {
        return status;
      }
    }
    return NodeStatus.Failure;
  }
}
