import { BehaviorTree } from '../../../core/ai/tree.js';
import { SequenceNode } from '../../../core/ai/composites.js';
import { CheckInactivityAction, ProbabilisticAction, SendNotificationAction } from '../actions/activity.actions.js';

export const createLowActivityTree = (osService: any) => {
  // 5분 이상 비활동 + 50% 확률 성공 시 알림 발송
  const root = new SequenceNode([
    new CheckInactivityAction(300000), 
    new ProbabilisticAction(0.5),
    new SendNotificationAction(osService, 'AI 알림', '5분마다 50% 확률로 알람을 전송중입니다.')
  ]);
  return new BehaviorTree(root);
};
