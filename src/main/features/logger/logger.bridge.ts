import { ipcRenderer } from 'electron';

/**
 * Logger Bridge
 */
export const loggerBridge = {
  selectLogFile: () => ipcRenderer.invoke('log-select-file'),
  log: (level: 'INFO' | 'ERROR' | 'DEBUG', message: string) => ipcRenderer.invoke('log-message', level, message)
};
