import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { container } from './core/di/container.main.js';
import type { SystemInfoService } from './core/system/system-info.service.js';
import type { AuditLogger } from './core/logger/audit-logger.service.js';
import type { SocketServer } from './core/network/socket.server.js';
import type { TcpClient } from './core/network/tcp.client.js';
import type { TcpServer } from './core/network/tcp.server.js';
import type { UdpClient } from './core/network/udp.client.js';
import type { OSIntegrationService } from './core/os/os-integration.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auditLogger = container.get<AuditLogger>('AuditLogger');
const systemInfo = container.get<SystemInfoService>('SystemInfoService');
const osIntegration = container.get<OSIntegrationService>('OSIntegrationService');
const tcpClient = container.get<TcpClient>('TcpClient');
const tcpServer = container.get<TcpServer>('TcpServer');
const socketServer = container.get<SocketServer>('SocketServer');
const udpClient = container.get<UdpClient>('UdpClient');

// 싱글 인스턴스 잠금 (Windows/Linux에서 딥링크 처리에 필수)
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    // Windows/Linux: 두 번째 인스턴스가 실행될 때 URL 추출
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      
      const url = commandLine.pop();
      if (url?.startsWith('my-app://')) {
        mainWindow.webContents.send('os-deeplink', url);
      }
    }
  });
}

let mainWindow: BrowserWindow | null = null;
let isQuitting = false; // 앱 완전 종료 플래그
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

  // 창 닫기 버튼 클릭 시 동작 제어
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault(); // 실제 파괴 방지
      mainWindow?.hide();    // 트레이로 숨김
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // OS 통합 기능 초기화 (트레이, 단축키 등)
  osIntegration.init(mainWindow);
}

// macOS: 앱이 실행 중일 때 URL로 호출될 경우
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) {
    mainWindow.webContents.send('os-deeplink', url);
  }
});

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

  // --- TCP Server ---
  ipcMain.handle('tcp-server-listen', async (_, port: number) => {
    try {
      await tcpServer.listen(
        port,
        (clientId, data) => mainWindow?.webContents.send('tcp-server-data', { clientId, data: data.toString() }),
        (msg) => mainWindow?.webContents.send('tcp-server-status', msg)
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
  ipcMain.on('tcp-server-send', (_, clientId, msg) => tcpServer.send(clientId, msg));
  ipcMain.on('tcp-server-broadcast', (_, msg) => tcpServer.broadcast(msg));
  ipcMain.on('tcp-server-close', () => tcpServer.close());
  ipcMain.handle('tcp-server-clients', () => tcpServer.getConnectedClients());

  // --- Socket.io Server ---
  ipcMain.handle('socket-server-listen', async (_, port: number) => {
    try {
      await socketServer.listen(
        port,
        (clientId, event, data) => mainWindow?.webContents.send('socket-server-data', { clientId, event, data: JSON.stringify(data) }),
        (msg) => mainWindow?.webContents.send('socket-server-status', msg)
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  });
  ipcMain.on('socket-server-emit', (_, clientId, event, data) => socketServer.emit(clientId, event, data));
  ipcMain.on('socket-server-broadcast', (_, event, data) => socketServer.broadcast(event, data));
  ipcMain.on('socket-server-close', () => socketServer.close());
  ipcMain.handle('socket-server-clients', () => socketServer.getConnectedClients());

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

  ipcMain.on('udp-close', () => udpClient.close());

  // --- Audit Logger ---
  ipcMain.on('record-audit-log', (_, action: string) => auditLogger.record(action));
  ipcMain.handle('get-log-path', () => app.getPath('userData'));

  // --- System Info ---
  ipcMain.handle('get-system-status', () => systemInfo.getStatus());

  // --- OS Integration ---
  ipcMain.on('os-notify', (_, title: string, body: string) => {
    osIntegration.notify(title, body);
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

// Windows 알림 활성화를 위한 App ID 설정
if (process.platform === 'win32') {
  app.setAppUserModelId('com.example.yourapp');
}

app.whenReady().then(() => {
  setupIpcHandlers();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('before-quit', () => {
  isQuitting = true;
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
