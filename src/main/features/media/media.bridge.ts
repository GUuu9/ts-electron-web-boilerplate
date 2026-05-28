import { ipcRenderer } from 'electron';

/**
 * Media Bridge
 */
export const mediaBridge = {
  selectBt: (id: string) => ipcRenderer.send('media-bt-select', id),
  selectUsb: (id: string) => ipcRenderer.send('media-usb-select', id),
  selectHid: (id: string) => ipcRenderer.send('media-hid-select', id),
  cancelSelect: () => ipcRenderer.send('media-cancel-select'),
  
  onBtList: (callback: (event: any, list: any[]) => void) => {
    ipcRenderer.on('media-bt-list', callback);
    return () => ipcRenderer.removeListener('media-bt-list', callback);
  },
  onUsbList: (callback: (event: any, list: any[]) => void) => {
    ipcRenderer.on('media-usb-list', callback);
    return () => ipcRenderer.removeListener('media-usb-list', callback);
  },
  onHidList: (callback: (event: any, list: any[]) => void) => {
    ipcRenderer.on('media-hid-list', callback);
    return () => ipcRenderer.removeListener('media-hid-list', callback);
  }
};
