import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

import { coreRegistry } from './core/core-registry.js';
import { NetworkCoreFeature } from './features/network/network.core.js';
import { DeviceCoreFeature } from './features/device/device.core.js';
import { LoggerCoreFeature } from './features/logger/logger.core.js';
import { SystemCoreFeature } from './features/system/system.core.js';
import { PersistenceCoreFeature } from './features/persistence/persistence.core.js';
import { OSCoreFeature } from './features/os/os.core.js';
import { LoggerWindowCoreFeature } from './features/logger/logger-window.core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. 코어 피처 등록 (이 리스트만 수정하면 기능 추가/삭제 가능)
coreRegistry.register(new NetworkCoreFeature());
coreRegistry.register(new DeviceCoreFeature());
coreRegistry.register(new LoggerCoreFeature());
coreRegistry.register(new SystemCoreFeature());
coreRegistry.register(new PersistenceCoreFeature());
coreRegistry.register(new OSCoreFeature());
coreRegistry.register(new LoggerWindowCoreFeature());

// 싱글 인스턴스 잠금 (Windows/Linux에서 딥링크 처리에 필수)
const gotTheLock = app.requestSingleInstanceLock();
let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
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

  // 등록된 모든 피처의 윈도우 관련 초기화 실행
  coreRegistry.onWindowCreatedAll(mainWindow);

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/ts-electron-web-boilerplate/');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// macOS 딥링크
app.on('open-url', (event, url) => {
  event.preventDefault();
  if (mainWindow) mainWindow.webContents.send('os-deeplink', url);
});

// Windows App ID
if (process.platform === 'win32') {
  app.setAppUserModelId('com.example.yourapp');
}

app.whenReady().then(() => {
  coreRegistry.initAll();
  coreRegistry.setupAllHandlers(mainWindow);
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on('before-quit', () => { isQuitting = true; });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
