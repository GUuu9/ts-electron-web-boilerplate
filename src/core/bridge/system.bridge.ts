import { ipcRenderer } from 'electron';

export const systemBridge = {
  maintenance: {
    getSystemStatus: () => ipcRenderer.invoke('get-system-status'),
    getLogPath: () => ipcRenderer.invoke('get-log-path')
  },
  persistence: {
    set: (key: string, value: any) => ipcRenderer.send('persistence-set', key, value),
    get: (key: string) => ipcRenderer.invoke('persistence-get', key)
  },
  os: {
    notify: (title: string, body: string) => ipcRenderer.send('os-notify', title, body),
    onDeepLink: (callback: (url: string) => void) => {
      ipcRenderer.removeAllListeners('os-deeplink');
      ipcRenderer.on('os-deeplink', (_event, url) => callback(url));
    }
  }
};
