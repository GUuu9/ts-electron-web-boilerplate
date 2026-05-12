import { ipcRenderer } from 'electron';

export const loggerBridge = {
  recordAuditLog: (action: string) => ipcRenderer.send('record-audit-log', action),
  logger: {
    open: () => ipcRenderer.invoke('logger-open'),
    send: (data: { message: string, isError: boolean }) => ipcRenderer.send('logger-log', data),
    onReceive: (callback: (data: { message: string, isError: boolean }) => void) => {
      ipcRenderer.removeAllListeners('logger-receive');
      ipcRenderer.on('logger-receive', (_event, data) => callback(data));
    },
    onClosed: (callback: () => void) => {
      ipcRenderer.removeAllListeners('logger-closed');
      ipcRenderer.on('logger-closed', () => callback());
    },
    sendCommand: (command: string) => ipcRenderer.send('logger-command', command),
    onCommand: (callback: (command: string) => void) => {
      ipcRenderer.removeAllListeners('execute-command');
      ipcRenderer.on('execute-command', (_event, cmd) => callback(cmd));
    }
  }
};
