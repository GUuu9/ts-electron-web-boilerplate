import { Composite } from './Composite.js';
import { NodeStatus } from './Node.js';

/**
 * Sequence 노드: 모든 자식이 SUCCESS를 반환할 때까지 순차적으로 실행합니다. (AND 조건/절차)
 */
export class Sequence extends Composite {
  public tick(): NodeStatus {
    for (const child of this.children) {
      const status = child.tick();
      if (status !== NodeStatus.SUCCESS) {
        return status;
      }
    }
    return NodeStatus.SUCCESS;
  }
}
