import { NodeStatus, Blackboard } from '../../../core/ai/base.js';
import { ActionNode } from '../../../core/ai/actions.js';

/**
 * 액션 노드: 현재 시간과 마지막 상호작용 시간을 비교하여 1분 이상 지났는지 체크
 */
export class CheckInactivityAction extends ActionNode {
  constructor(private timeoutMs: number = 60000) { super(); }

  public tick(blackboard: Blackboard): NodeStatus {
    const lastInteraction = blackboard.get('lastInteraction') || 0;
    const now = Date.now();
    const diff = now - lastInteraction;
    
    console.log(`[AI Debug] Inactivity check: diff=${diff}ms, timeout=${this.timeoutMs}ms`);

    if (diff > this.timeoutMs) {
      return NodeStatus.SUCCESS;
    }
    return NodeStatus.FAILURE;
  }
}

/**
 * 액션 노드: 확률적으로 SUCCESS/FAILURE를 반환
 */
export class ProbabilisticAction extends ActionNode {
  constructor(private probability: number) { super(); }

  public tick(): NodeStatus {
    return Math.random() < this.probability ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
  }
}

/**
 * 액션 노드: OS 알림 전송
 */
export class SendNotificationAction extends ActionNode {
  constructor(private osService: any, private title: string, private body: string) { super(); }

  public tick(blackboard: Blackboard): NodeStatus {
    this.osService.notify(this.title, this.body);
    console.log(`[AI] Notification sent: ${this.title}`);
    
    // 알림 전송 후 상호작용 시간을 갱신하여 쿨타임(1분)을 강제로 생성
    blackboard.set('lastInteraction', Date.now());
    
    return NodeStatus.SUCCESS;
  }
}
