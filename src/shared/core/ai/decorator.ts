import { BaseNode, Blackboard, NodeStatus } from './base.js';

/**
 * 하나의 노드를 꾸며 그 결과나 흐름을 변형하는 데코레이터 노드입니다.
 */
export abstract class DecoratorNode extends BaseNode {
  constructor(protected child: BaseNode) {
    super();
  }
}

/**
 * 하위 노드의 결과를 반전시키는 인버터 노드입니다.
 * Success -> Failure, Failure -> Success
 */
export class InverterNode extends DecoratorNode {
  tick(blackboard: Blackboard): NodeStatus {
    const status = this.child.tick(blackboard);
    if (status === NodeStatus.Success) return NodeStatus.Failure;
    if (status === NodeStatus.Failure) return NodeStatus.Success;
    return status;
  }
}
