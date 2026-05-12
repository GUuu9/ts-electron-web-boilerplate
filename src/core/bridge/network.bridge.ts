import { ipcRenderer } from 'electron';

export const networkBridge = {
  tcp: {
    connect: (host: string, port: number) => ipcRenderer.invoke('tcp-connect', host, port),
    send: (message: string) => ipcRenderer.send('tcp-send', message),
    onData: (callback: (data: string) => void) => {
      ipcRenderer.removeAllListeners('tcp-data');
      ipcRenderer.on('tcp-data', (_event, data) => callback(data));
    },
    disconnect: () => ipcRenderer.send('tcp-disconnect')
  },
  tcpServer: {
    listen: (port: number) => ipcRenderer.invoke('tcp-server-listen', port),
    send: (clientId: string, message: string) => ipcRenderer.send('tcp-server-send', clientId, message),
    broadcast: (message: string) => ipcRenderer.send('tcp-server-broadcast', message),
    close: () => ipcRenderer.send('tcp-server-close'),
    getClients: () => ipcRenderer.invoke('tcp-server-clients'),
    onData: (callback: (data: { clientId: string, data: string }) => void) => {
      ipcRenderer.removeAllListeners('tcp-server-data');
      ipcRenderer.on('tcp-server-data', (_event, data) => callback(data));
    },
    onStatus: (callback: (message: string) => void) => {
      ipcRenderer.removeAllListeners('tcp-server-status');
      ipcRenderer.on('tcp-server-status', (_event, msg) => callback(msg));
    }
  },
  socketServer: {
    listen: (port: number) => ipcRenderer.invoke('socket-server-listen', port),
    emit: (clientId: string, event: string, data: any) => ipcRenderer.send('socket-server-emit', clientId, event, data),
    broadcast: (event: string, data: any) => ipcRenderer.send('socket-server-broadcast', event, data),
    close: () => ipcRenderer.send('socket-server-close'),
    getClients: () => ipcRenderer.invoke('socket-server-clients'),
    onData: (callback: (data: { clientId: string, event: string, data: string }) => void) => {
      ipcRenderer.removeAllListeners('socket-server-data');
      ipcRenderer.on('socket-server-data', (_event, data) => callback(data));
    },
    onStatus: (callback: (message: string) => void) => {
      ipcRenderer.removeAllListeners('socket-server-status');
      ipcRenderer.on('socket-server-status', (_event, msg) => callback(msg));
    }
  },
  udp: {
    bind: (port: number) => ipcRenderer.invoke('udp-bind', port),
    send: (message: string, port: number, host: string) => ipcRenderer.invoke('udp-send', message, port, host),
    onData: (callback: (data: { message: string, address: string, port: number }) => void) => {
      ipcRenderer.removeAllListeners('udp-data');
      ipcRenderer.on('udp-data', (_event, data) => callback(data));
    },
    close: () => ipcRenderer.send('udp-close')
  }
};
