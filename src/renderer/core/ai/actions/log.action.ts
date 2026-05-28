import { Blackboard, NodeStatus, BaseAction } from '../../../../shared/core/ai/base.js';


/**
 * 콘솔에 로그를 남기는 샘플 액션입니다.
 */
export class LogAction extends BaseAction {
  constructor(private message: string) {
    super();
  }

  run(blackboard: Blackboard): NodeStatus {
    console.log(`[AI Action]: ${this.message}`);
    return NodeStatus.Success;
  }
}
