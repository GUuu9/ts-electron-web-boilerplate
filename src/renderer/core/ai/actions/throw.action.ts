import { Blackboard, NodeStatus, BaseAction } from '../../../../shared/core/ai/base.js';

/**
 * 투사체를 발사하라는 명령만 내리는 액션입니다.
 * 명중하거나 바닥에 닿은 후 Blackboard의 'isThrowing'이 false로 초기화되면 다시 실행됩니다.
 */
export class ThrowAction extends BaseAction {
  run(blackboard: Blackboard): NodeStatus {
    // isThrowing이 false일 때만 발사 명령을 내림
    if (blackboard.has('targetPos') && !blackboard.get('isThrowing')) {
      blackboard.set('isThrowing', true);
      console.log('[AI] 발사 명령');
      return NodeStatus.Success;
    }
    return NodeStatus.Failure;
  }
}
