import { Blackboard, NodeStatus, BaseAction } from '../../../../shared/core/ai/base.js';

/**
 * 목표물을 생성하는 액션입니다.
 */
export class FindTargetAction extends BaseAction {
  run(blackboard: Blackboard): NodeStatus {
    if (!blackboard.has('targetPos')) {
      blackboard.set('targetPos', { x: 600 + Math.random() * 100, y: 100 + Math.random() * 400 });
      console.log('[AI] 타겟 생성됨');
    }
    return NodeStatus.Success;
  }
}
