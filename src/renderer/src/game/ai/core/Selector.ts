import { Composite } from './Composite.js';
import { NodeStatus } from './Node.js';

/**
 * Selector 노드: 자식 중 하나가 SUCCESS를 반환할 때까지 실행합니다. (OR 조건/우선순위)
 */
export class Selector extends Composite {
  public tick(): NodeStatus {
    for (const child of this.children) {
      const status = child.tick();
      if (status !== NodeStatus.FAILURE) {
        return status;
      }
    }
    return NodeStatus.FAILURE;
  }
}
