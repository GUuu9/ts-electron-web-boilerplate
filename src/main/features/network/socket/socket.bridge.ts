import { ipcRenderer } from 'electron';

/**
 * SocketBridge: 렌더러와 통신하기 위한 브릿지 API 규격입니다.
 */
export const socketBridge = {
  startServer: (port: number) => ipcRenderer.invoke('socket:startServer', port),
  stopServer: () => ipcRenderer.invoke('socket:stopServer'),
  broadcast: (event: string, data: any) => ipcRenderer.invoke('socket:broadcast', event, data),
};
