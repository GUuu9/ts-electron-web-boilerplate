import { contextBridge } from 'electron';
import { networkBridge } from './core/bridge/network.bridge.js';
import { deviceBridge } from './core/bridge/device.bridge.js';
import { loggerBridge } from './core/bridge/logger.bridge.js';
import { systemBridge } from './core/bridge/system.bridge.js';
import { aiBridge } from './core/bridge/ai.bridge.js';

// 렌더러 프로세스(웹 화면)에서 노출될 안전한 API 정의
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  ...networkBridge,
  ...deviceBridge,
  ...loggerBridge,
  ...systemBridge,
  ...aiBridge
});
