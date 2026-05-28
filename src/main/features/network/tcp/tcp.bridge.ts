import { ipcRenderer } from 'electron';

export const tcpBridge = {
  listen: (port: number) => ipcRenderer.invoke('tcp-server-listen', port)
};
