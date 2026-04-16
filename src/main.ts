import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { container } from './core/di/container.main.js';
import type { TcpClient } from './core/network/tcp.client.js';
import type { UdpClient } from './core/network/udp.client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tcpClient = container.get<TcpClient>('TcpClient');
const udpClient = container.get<UdpClient>('UdpClient');

let mainWindow: BrowserWindow | null = null;
let selectBluetoothCallback: ((id: string) => void) | null = null;
let selectUsbCallback: ((id: string) => void) | null = null;
let selectHidCallback: ((id: string) => void) | null = null;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
  });

  // 1. 블루투스 (WebContents 이벤트)
  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    selectBluetoothCallback = callback;
    mainWindow?.webContents.send('bt-device-list', deviceList.map(d => ({
      deviceId: d.deviceId,
      deviceName: d.deviceName || '알 수 없는 블루투스 장치'
    })));
  });

  // 2. USB (Session 이벤트)
  mainWindow.webContents.session.on('select-usb-device', (event, details, callback) => {
    event.preventDefault();
    selectUsbCallback = callback;
    mainWindow?.webContents.send('usb-device-list', details.deviceList.map(d => ({
      deviceId: d.deviceId,
      deviceName: d.productName || `USB 장치 (0x${d.vendorId.toString(16)})`
    })));
  });

  // 3. HID (Session 이벤트)
  mainWindow.webContents.session.on('select-hid-device', (event, details, callback) => {
    event.preventDefault();
    selectHidCallback = callback;
    mainWindow?.webContents.send('hid-device-list', details.deviceList.map(d => ({
      deviceId: d.deviceId,
      deviceName: (d as any).deviceName || (d as any).productName || `HID 장치 (0x${d.vendorId.toString(16)})`
    })));
  });

  // 권한 자동 부여
  mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission) => {
    return ['usb', 'hid', 'bluetooth'].includes(permission);
  });

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    return ['usb', 'hid', 'bluetooth'].includes(details.deviceType as string);
  });

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function setupIpcHandlers() {
  ipcMain.handle('tcp-connect', async (_event, host: string, port: number) => {
    try {
      await tcpClient.connect(host, port);
      tcpClient.onData((data) => mainWindow?.webContents.send('tcp-data', data.toString()));
      tcpClient.onClose(() => mainWindow?.webContents.send('tcp-closed'));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.on('tcp-send', (_, msg) => tcpClient.send(msg));
  ipcMain.on('tcp-disconnect', () => tcpClient.disconnect());

  ipcMain.handle('udp-bind', async (_event, port: number) => {
    try {
      udpClient.bind(port);
      udpClient.onMessage((msg, rinfo) => {
        mainWindow?.webContents.send('udp-data', { message: msg.toString(), address: rinfo.address, port: rinfo.port });
      });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.handle('udp-send', async (_, msg, port, host) => {
    try {
      await udpClient.send(msg, port, host);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });

  ipcMain.on('bt-select-device', (_, id) => { if (selectBluetoothCallback) { selectBluetoothCallback(id); selectBluetoothCallback = null; }});
  ipcMain.on('usb-select-device', (_, id) => { if (selectUsbCallback) { selectUsbCallback(id); selectUsbCallback = null; }});
  ipcMain.on('hid-select-device', (_, id) => { if (selectHidCallback) { selectHidCallback(id); selectHidCallback = null; }});

  ipcMain.on('device-cancel-select', () => {
    if (selectBluetoothCallback) { selectBluetoothCallback(''); selectBluetoothCallback = null; }
    if (selectUsbCallback) { selectUsbCallback(''); selectUsbCallback = null; }
    if (selectHidCallback) { selectHidCallback(''); selectHidCallback = null; }
  });
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
