import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';

/**
 * Media & Device Core 모듈
 * Bluetooth, USB, HID 장치 선택 및 미디어(카메라/마이크) 권한을 담당합니다.
 */
export class MediaCoreModule implements BackendModule {
  private selectBluetoothCallback: ((id: string) => void) | null = null;
  private selectUsbCallback: ((id: string) => void) | null = null;
  private selectHidCallback: ((id: string) => void) | null = null;

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    if (!mainWindow) return;

    // 1. 블루투스 장치 선택
    mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
      event.preventDefault();
      this.selectBluetoothCallback = callback;
      mainWindow.webContents.send('media-bt-list', deviceList.map(d => ({
        deviceId: d.deviceId,
        deviceName: d.deviceName || '알 수 없는 블루투스 장치'
      })));
    });

    // 2. USB 장치 선택
    mainWindow.webContents.session.on('select-usb-device', (event, details, callback) => {
      event.preventDefault();
      this.selectUsbCallback = callback;
      mainWindow.webContents.send('media-usb-list', details.deviceList.map(d => ({
        deviceId: d.deviceId,
        deviceName: (d as any).productName || `USB 장치 (0x${d.vendorId.toString(16)})`
      })));
    });

    // 3. HID 장치 선택
    mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
      event.preventDefault();
      this.selectHidCallback = callback;
      mainWindow.webContents.send('media-hid-list', details.deviceList.map(d => ({
        deviceId: d.deviceId,
        deviceName: (d as any).deviceName || (d as any).productName || `HID 장치 (0x${d.vendorId.toString(16)})`
      })));
    });

    // 4. 권한 핸들러 (카메라, 마이크, BT, USB 등)
    mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission) => {
      return ['usb', 'hid', 'bluetooth', 'media', 'audioCapture', 'videoCapture'].includes(permission);
    });

    mainWindow.webContents.session.setDevicePermissionHandler((details) => {
      return ['usb', 'hid', 'bluetooth'].includes(details.deviceType as string);
    });

    // 5. 렌더러 선택 결과 수신
    ipcMain.on('media-bt-select', (_, id) => {
      if (this.selectBluetoothCallback) { this.selectBluetoothCallback(id); this.selectBluetoothCallback = null; }
    });
    ipcMain.on('media-usb-select', (_, id) => {
      if (this.selectUsbCallback) { this.selectUsbCallback(id); this.selectUsbCallback = null; }
    });
    ipcMain.on('media-hid-select', (_, id) => {
      if (this.selectHidCallback) { this.selectHidCallback(id); this.selectHidCallback = null; }
    });
    ipcMain.on('media-cancel-select', () => {
      this.clearCallbacks();
    });
  }

  private clearCallbacks() {
    if (this.selectBluetoothCallback) this.selectBluetoothCallback('');
    if (this.selectUsbCallback) this.selectUsbCallback('');
    if (this.selectHidCallback) this.selectHidCallback('');
    this.selectBluetoothCallback = null;
    this.selectUsbCallback = null;
    this.selectHidCallback = null;
  }
}
