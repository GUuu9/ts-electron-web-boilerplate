import { Node, NodeStatus, CompositeNode, Blackboard } from './base.js';

/**
 * Selector 노드: 자식 중 하나라도 SUCCESS를 반환하면 SUCCESS를 반환합니다.
 */
export class SelectorNode extends CompositeNode {
  public tick(blackboard: Blackboard): NodeStatus {
    for (const child of this.children) {
      const status = child.tick(blackboard);
      if (status !== NodeStatus.FAILURE) {
        return status;
      }
    }
    return NodeStatus.FAILURE;
  }
}

/**
 * Sequence 노드: 자식 중 하나라도 FAILURE를 반환하면 FAILURE를 반환합니다.
 */
export class SequenceNode extends CompositeNode {
  public tick(blackboard: Blackboard): NodeStatus {
    for (const child of this.children) {
      const status = child.tick(blackboard);
      if (status !== NodeStatus.SUCCESS) {
        return status;
      }
    }
    return NodeStatus.SUCCESS;
  }
}
