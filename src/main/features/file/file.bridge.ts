import { ipcRenderer } from 'electron';

/**
 * File Bridge
 */
export const fileBridge = {
  read: (path: string) => ipcRenderer.invoke('file-read', path),
  write: (path: string, content: string) => ipcRenderer.invoke('file-write', path, content),
  openDialog: () => ipcRenderer.invoke('file-open-dialog')
};
