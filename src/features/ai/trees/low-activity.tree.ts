import { BehaviorTree } from '../../../core/ai/tree.js';
import { SequenceNode } from '../../../core/ai/composites.js';
import { CheckInactivityAction, ProbabilisticAction, SendNotificationAction } from '../actions/activity.actions.js';

export const createLowActivityTree = (osService: any) => {
  // 1분 이상 비활동 + 50% 확률 성공 시 알림 발송
  const root = new SequenceNode([
    new CheckInactivityAction(60000), 
    new ProbabilisticAction(1),
    new SendNotificationAction(osService, 'AI 알림', '오랫동안 활동이 없으시네요! 휴식은 어떠신가요?')
  ]);
  return new BehaviorTree(root);
};
