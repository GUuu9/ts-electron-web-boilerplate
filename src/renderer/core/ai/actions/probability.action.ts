import { Blackboard, NodeStatus, BaseAction } from '../../../../shared/core/ai/base.js';


/**
 * 설정된 확률에 따라 성공 또는 실패를 반환하는 액션입니다.
 */
export class ProbabilityAction extends BaseAction {
  /**
   * @param successProbability 성공 확률 (0.0 ~ 1.0)
   */
  constructor(private successProbability: number) {
    super();
  }

  run(blackboard: Blackboard): NodeStatus {
    const randomValue = Math.random();
    
    if (randomValue < this.successProbability) {
      console.log(`[AI Action]: ProbabilityAction Success (Random: ${randomValue.toFixed(2)})`);
      return NodeStatus.Success;
    } else {
      console.log(`[AI Action]: ProbabilityAction Failure (Random: ${randomValue.toFixed(2)})`);
      return NodeStatus.Failure;
    }
  }
}
