import { ipcMain, BrowserWindow, app } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { CoreFeature } from '../../core/core-feature.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Logger Window Core Feature (외부 로그 창 제어)
 */
export class LoggerWindowCoreFeature implements CoreFeature {
  id = 'loggerWindow';
  private loggerWindow: BrowserWindow | null = null;

  setupHandlers(mainWindow: BrowserWindow | null) {
    ipcMain.handle('logger-open', () => {
      this.createLoggerWindow(mainWindow);
      return { success: true };
    });

    ipcMain.on('logger-log', (_, data) => {
      if (this.loggerWindow && !this.loggerWindow.isDestroyed()) {
        this.loggerWindow.webContents.send('logger-receive', data);
      }
    });

    ipcMain.on('logger-command', (_, command) => {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('execute-command', command);
      }
    });
  }

  private createLoggerWindow(mainWindow: BrowserWindow | null) {
    if (this.loggerWindow) {
      this.loggerWindow.focus();
      return;
    }

    const preloadPath = path.join(__dirname, '../../preload.js');
    this.loggerWindow = new BrowserWindow({
      width: 600,
      height: 400,
      title: 'System UI Logger',
      backgroundColor: '#0f172a',
      webPreferences: {
        preload: preloadPath,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
      },
    });

    const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
    if (isDev) {
      this.loggerWindow.loadURL('http://localhost:5173/ts-electron-web-boilerplate/logger.html');
    } else {
      this.loggerWindow.loadFile(path.join(__dirname, '../../dist/logger.html'));
    }

    this.loggerWindow.on('closed', () => {
      this.loggerWindow = null;
      mainWindow?.webContents.send('logger-closed');
    });
  }
}
