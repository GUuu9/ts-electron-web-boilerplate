import { BehaviorTree } from '../../../core/ai/tree.js';
import { SelectorNode } from '../../../core/ai/composites.js';
import { CallServiceAction, LogAction } from '../actions/generic.actions.js';

export const createDeviceManagerTree = (deviceService: any) => {
  // 장치가 연결되어 있거나, 연결되지 않았으면 재연결 시도
  const root = new SelectorNode([
    new CallServiceAction(deviceService, 'isConnected', 'isDeviceConnected'),
    new CallServiceAction(deviceService, 'reconnect', 'isDeviceConnected'),
    new LogAction('Device managed.')
  ]);
  return new BehaviorTree(root);
};
