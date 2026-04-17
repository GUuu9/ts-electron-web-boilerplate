import { contextBridge, ipcRenderer } from 'electron';

// 렌더러 프로세스(웹 화면)에서 노출될 안전한 API 정의
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  
  // TCP 통신 브릿지
  tcp: {
    connect: (host: string, port: number) => ipcRenderer.invoke('tcp-connect', host, port),
    send: (message: string) => ipcRenderer.send('tcp-send', message),
    onData: (callback: (data: string) => void) => {
      ipcRenderer.removeAllListeners('tcp-data');
      ipcRenderer.on('tcp-data', (_event, data) => callback(data));
    },
    disconnect: () => ipcRenderer.send('tcp-disconnect')
  },

  // TCP 서버 브릿지 (신규 추가)
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

  // Socket.io 서버 브릿지 (신규 추가)
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

  // UDP 통신 브릿지
  udp: {
    bind: (port: number) => ipcRenderer.invoke('udp-bind', port),
    send: (message: string, port: number, host: string) => ipcRenderer.invoke('udp-send', message, port, host),
    onData: (callback: (data: { message: string, address: string, port: number }) => void) => {
      ipcRenderer.removeAllListeners('udp-data');
      ipcRenderer.on('udp-data', (_event, data) => callback(data));
    },
    close: () => ipcRenderer.send('udp-close')
  },

  // 통합 장치 선택 브릿지 (BT/USB/HID)
  devices: {
    // 블루투스
    onBluetoothList: (callback: (list: any[]) => void) => {
      ipcRenderer.removeAllListeners('bt-device-list');
      ipcRenderer.on('bt-device-list', (_event, list) => callback(list));
    },
    selectBluetooth: (id: string) => ipcRenderer.send('bt-select-device', id),

    // USB (추가됨)
    onUsbList: (callback: (list: any[]) => void) => {
      ipcRenderer.removeAllListeners('usb-device-list');
      ipcRenderer.on('usb-device-list', (_event, list) => callback(list));
    },
    selectUsb: (id: string) => ipcRenderer.send('usb-select-device', id),

    // HID (추가됨)
    onHidList: (callback: (list: any[]) => void) => {
      ipcRenderer.removeAllListeners('hid-device-list');
      ipcRenderer.on('hid-device-list', (_event, list) => callback(list));
    },
    selectHid: (id: string) => ipcRenderer.send('hid-select-device', id),

    // 공통 취소
    cancelSelect: () => ipcRenderer.send('device-cancel-select')
  }
});
