import { NodeStatus, Blackboard } from '../../../core/ai/base.js';
import { ActionNode } from '../../../core/ai/actions.js';

/**
 * 범용 서비스 호출 액션 노드
 * 서비스의 특정 메서드를 호출하고 결과를 Blackboard에 저장하거나 SUCCESS/FAILURE로 반환
 */
export class CallServiceAction extends ActionNode {
  constructor(
    private service: any,
    private method: string,
    private key?: string
  ) { super(); }

  public tick(blackboard: Blackboard): NodeStatus {
    try {
      const result = this.service[this.method]();
      if (this.key) blackboard.set(this.key, result);
      return result ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
    } catch (e) {
      return NodeStatus.FAILURE;
    }
  }
}

/**
 * 단순 로그 액션 노드
 */
export class LogAction extends ActionNode {
  constructor(private message: string) { super(); }
  public tick(): NodeStatus {
    console.log(`[AI Log] ${this.message}`);
    return NodeStatus.SUCCESS;
  }
}

/**
 * 대기 액션 노드 (간단한 예시)
 */
export class WaitAction extends ActionNode {
  constructor(private duration: number) { super(); }
  public tick(): NodeStatus {
    // 실제 구현시 타이머 관리 로직이 필요함
    return NodeStatus.SUCCESS;
  }
}
