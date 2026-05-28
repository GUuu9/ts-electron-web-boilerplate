import { BehaviorTree } from '../../../../shared/core/ai/tree.js';
import { SequenceNode } from '../../../../shared/core/ai/composite.js';
import { LogAction } from '../actions/log.action.js';
import { ProbabilityAction } from '../actions/probability.action.js';

/**
 * 예시 행동 트리 설정입니다.
 */
export function createExampleTree(): BehaviorTree {
  const root = new SequenceNode([
    new ProbabilityAction(0.01),
    new LogAction('트리 실행 시작'),
    new LogAction('작업 수행 중...'),
    new LogAction('작업 완료!')
  ]);

  return new BehaviorTree(root);
}
