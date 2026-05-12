import { ipcMain, type BrowserWindow } from 'electron';
import type { CoreFeature } from '../../core/core-feature.js';

/**
 * Device Core Feature
 * Bluetooth, USB, HID 장치 선택 및 권한 제어를 담당합니다.
 */
export class DeviceCoreFeature implements CoreFeature {
  id = 'device';
  private selectBluetoothCallback: ((id: string) => void) | null = null;
  private selectUsbCallback: ((id: string) => void) | null = null;
  private selectHidCallback: ((id: string) => void) | null = null;

  onWindowCreated(mainWindow: BrowserWindow) {
    // 1. 블루투스
    mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
      event.preventDefault();
      this.selectBluetoothCallback = callback;
      mainWindow?.webContents.send('bt-device-list', deviceList.map(d => ({
        deviceId: d.deviceId,
        deviceName: d.deviceName || '알 수 없는 블루투스 장치'
      })));
    });

    // 2. USB
    mainWindow.webContents.session.on('select-usb-device', (event, details, callback) => {
      event.preventDefault();
      this.selectUsbCallback = callback;
      mainWindow?.webContents.send('usb-device-list', details.deviceList.map(d => ({
        deviceId: d.deviceId,
        deviceName: (d as any).productName || `USB 장치 (0x${d.vendorId.toString(16)})`
      })));
    });

    // 3. HID
    mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
      event.preventDefault();
      this.selectHidCallback = callback;
      mainWindow?.webContents.send('hid-device-list', details.deviceList.map(d => ({
        deviceId: d.deviceId,
        deviceName: (d as any).deviceName || (d as any).productName || `HID 장치 (0x${d.vendorId.toString(16)})`
      })));
    });

    // 권한 설정
    mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission) => {
      return ['usb', 'hid', 'bluetooth'].includes(permission);
    });

    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
      return ['usb', 'hid', 'bluetooth'].includes(details.deviceType as string);
    });
  }

  setupHandlers() {
    ipcMain.on('bt-select-device', (_, id) => { if (this.selectBluetoothCallback) { this.selectBluetoothCallback(id); this.selectBluetoothCallback = null; }});
    ipcMain.on('usb-select-device', (_, id) => { if (this.selectUsbCallback) { this.selectUsbCallback(id); this.selectUsbCallback = null; }});
    ipcMain.on('hid-select-device', (_, id) => { if (this.selectHidCallback) { this.selectHidCallback(id); this.selectHidCallback = null; }});

    ipcMain.on('device-cancel-select', () => {
      if (this.selectBluetoothCallback) { this.selectBluetoothCallback(''); this.selectBluetoothCallback = null; }
      if (this.selectUsbCallback) { this.selectUsbCallback(''); this.selectUsbCallback = null; }
      if (this.selectHidCallback) { this.selectHidCallback(''); this.selectHidCallback = null; }
    });
  }
}
