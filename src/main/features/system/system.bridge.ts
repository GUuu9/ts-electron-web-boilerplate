import { ipcRenderer } from 'electron';

/**
 * System Bridge
 * 렌더러에 노출할 시스템 정보 API 규격
 */
export const systemBridge = {
  getStatus: () => ipcRenderer.invoke('system-get-status')
};
