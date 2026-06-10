import { ipcRenderer } from 'electron';

/**
 * AutomationBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const automationBridge = {
  moveMouse: (x: number, y: number) => ipcRenderer.invoke('automation:moveMouse', x, y),
  getMousePosition: () => ipcRenderer.invoke('automation:getMousePosition'),
  clickMouse: (button: 'left' | 'right' | 'middle', durationMs?: number) => 
    ipcRenderer.invoke('automation:clickMouse', button, durationMs),
  doubleClickMouse: () => ipcRenderer.invoke('automation:doubleClickMouse'),
  scrollMouse: (amount: number) => ipcRenderer.invoke('automation:scrollMouse', amount),
  dragMouse: (fromX: number, fromY: number, toX: number, toY: number) => 
    ipcRenderer.invoke('automation:dragMouse', fromX, fromY, toX, toY),
  typeText: (text: string) => ipcRenderer.invoke('automation:typeText', text),
  pressKey: (key: string, durationMs?: number) => 
    ipcRenderer.invoke('automation:pressKey', key, durationMs),
  onStartShortcut: (callback: () => void) => ipcRenderer.on('macro:start-shortcut', () => callback()),
  onStopShortcut: (callback: () => void) => ipcRenderer.on('macro:stop-shortcut', () => callback()),
  onPickShortcut: (callback: () => void) => ipcRenderer.on('macro:pick-shortcut', () => callback()),
};
