import { ipcRenderer } from 'electron';

export const udpBridge = {
  bind: (port: number) => ipcRenderer.invoke('udp-bind', port),
  send: (data: { msg: string; port: number; address: string }) => ipcRenderer.invoke('udp-send', data)
};
