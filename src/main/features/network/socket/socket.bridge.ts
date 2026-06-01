import { ipcRenderer } from 'electron';

/**
 * SocketBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const socketBridge = {
  startServer: (port: number) => ipcRenderer.invoke('socket:startServer', port),
  stopServer: () => ipcRenderer.invoke('socket:stopServer'),
  broadcast: (event: string, data: any) => ipcRenderer.invoke('socket:broadcast', event, data),
  listenEvent: (event: string) => ipcRenderer.invoke('socket:listenEvent', event),
  onServerReceived: (callback: (data: any) => void) => {
    const listener = (_: any, data: any) => callback(data);
    ipcRenderer.on('socket:onServerReceived', listener);
    return () => ipcRenderer.removeListener('socket:onServerReceived', listener);
  },
};
