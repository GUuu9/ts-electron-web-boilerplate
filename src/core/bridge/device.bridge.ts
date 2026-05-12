import { ipcRenderer } from 'electron';

export const deviceBridge = {
  devices: {
    onBluetoothList: (callback: (list: any[]) => void) => {
      ipcRenderer.removeAllListeners('bt-device-list');
      ipcRenderer.on('bt-device-list', (_event, list) => callback(list));
    },
    selectBluetooth: (id: string) => ipcRenderer.send('bt-select-device', id),
    onUsbList: (callback: (list: any[]) => void) => {
      ipcRenderer.removeAllListeners('usb-device-list');
      ipcRenderer.on('usb-device-list', (_event, list) => callback(list));
    },
    selectUsb: (id: string) => ipcRenderer.send('usb-select-device', id),
    onHidList: (callback: (list: any[]) => void) => {
      ipcRenderer.removeAllListeners('hid-device-list');
      ipcRenderer.on('hid-device-list', (_event, list) => callback(list));
    },
    selectHid: (id: string) => ipcRenderer.send('hid-select-device', id),
    cancelSelect: () => ipcRenderer.send('device-cancel-select')
  }
};
