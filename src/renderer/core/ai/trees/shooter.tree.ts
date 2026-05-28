import { BehaviorTree } from '../../../../shared/core/ai/tree.js';
import { SequenceNode } from '../../../../shared/core/ai/composite.js';
import { FindTargetAction } from '../actions/find-target.action.js';
import { CalculateAimAction } from '../actions/calculate-aim.action.js';
import { ThrowAction } from '../actions/throw.action.js';

/**
 * 예시 슈팅 행동 트리 설정입니다.
 */
export function createShooterTree(): BehaviorTree {
  const root = new SequenceNode([
    new FindTargetAction(),
    new CalculateAimAction(),
    new ThrowAction()
  ]);
  return new BehaviorTree(root);
}
