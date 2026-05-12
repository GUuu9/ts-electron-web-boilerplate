import { BehaviorTree } from '../../../core/ai/tree.js';
import { SequenceNode } from '../../../core/ai/composites.js';
import { CallServiceAction, LogAction } from '../actions/generic.actions.js';

export const createNetworkMonitorTree = (networkService: any) => {
  const root = new SequenceNode([
    new CallServiceAction(networkService, 'checkConnection', 'isNetworkConnected'),
    new LogAction('Network connectivity verified.')
  ]);
  return new BehaviorTree(root);
};
