import { ipcRenderer } from 'electron';

export const osBridge = {
  notify: (title: string, body: string) => ipcRenderer.invoke('os-notify', title, body),
};
