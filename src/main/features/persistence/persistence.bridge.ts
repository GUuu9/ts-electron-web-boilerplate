import { ipcRenderer } from 'electron';

/**
 * Persistence Bridge
 */
export const persistenceBridge = {
  save: (key: string, value: any) => ipcRenderer.invoke('persistence-save', key, value),
  load: (key: string) => ipcRenderer.invoke('persistence-load', key)
};
