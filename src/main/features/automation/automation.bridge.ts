import { ipcRenderer } from 'electron';

/**
 * AutomationBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const automationBridge = {
  moveMouse: (x: number, y: number) => ipcRenderer.invoke('automation:moveMouse', x, y),
  clickMouse: (button: 'left' | 'right' | 'middle', durationMs?: number) => 
    ipcRenderer.invoke('automation:clickMouse', button, durationMs),
  typeText: (text: string) => ipcRenderer.invoke('automation:typeText', text),
  pressKey: (key: string, durationMs?: number) => 
    ipcRenderer.invoke('automation:pressKey', key, durationMs),
};
