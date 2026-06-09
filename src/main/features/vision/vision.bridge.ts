import { ipcRenderer } from 'electron';

/**
 * VisionBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const visionBridge = {
  processScreen: () => ipcRenderer.invoke('vision:processScreen'),
};
