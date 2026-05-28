import { ipcRenderer } from 'electron';

/**
 * Serial Bridge
 */
export const serialBridge = {
  listPorts: () => ipcRenderer.invoke('serial-list-ports'),
  open: (path: string, baudRate: number) => ipcRenderer.invoke('serial-open', path, baudRate),
  close: (path: string) => ipcRenderer.invoke('serial-close', path),
  write: (path: string, data: string) => ipcRenderer.invoke('serial-write', path, data),
  onData: (callback: (event: any, data: { path: string, data: string }) => void) => {
    ipcRenderer.on('serial-data', callback);
    return () => ipcRenderer.removeListener('serial-data', callback);
  }
};
