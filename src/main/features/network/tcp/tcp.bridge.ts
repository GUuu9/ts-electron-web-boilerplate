import { ipcRenderer } from 'electron';

export const tcpBridge = {
  // Server
  startServer: (port: number) => ipcRenderer.invoke('tcp:startServer', port),
  stopServer: () => ipcRenderer.invoke('tcp:stopServer'),
  serverSend: (clientId: string, data: string) => ipcRenderer.invoke('tcp:serverSend', { clientId, data }),
  serverBroadcast: (data: string) => ipcRenderer.invoke('tcp:serverBroadcast', data),
  
  // Client
  connect: (host: string, port: number) => ipcRenderer.invoke('tcp:connect', { host, port }),
  disconnect: () => ipcRenderer.invoke('tcp:disconnect'),
  clientSend: (data: string) => ipcRenderer.invoke('tcp:clientSend', data),

  // Events
  onServerConnected: (callback: (clientId: string) => void) => ipcRenderer.on('tcp:onServerConnected', (_, clientId) => callback(clientId)),
  onServerDisconnected: (callback: (clientId: string) => void) => ipcRenderer.on('tcp:onServerDisconnected', (_, clientId) => callback(clientId)),
  onServerData: (callback: (data: { clientId: string, data: string }) => void) => ipcRenderer.on('tcp:onServerData', (_, payload) => callback(payload)),
  onClientConnected: (callback: () => void) => ipcRenderer.on('tcp:onClientConnected', () => callback()),
  onClientDisconnected: (callback: () => void) => ipcRenderer.on('tcp:onClientDisconnected', () => callback()),
  onClientData: (callback: (data: string) => void) => ipcRenderer.on('tcp:onClientData', (_, data) => callback(data)),
};
