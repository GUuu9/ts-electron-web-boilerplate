import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { AutomationServer } from './automation.server.js';

/**
 * AutomationCore: 백엔드 모듈 구현 및 IPC 핸들러 등록
 */
export class AutomationCore implements BackendModule {
  private server: AutomationServer;

  constructor() {
    this.server = new AutomationServer();
  }

  public init() {
    console.log('[AUTOMATION] Automation Feature 초기화');
  }

  setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('automation:moveMouse', async (_, x: number, y: number) => {
      return await this.server.moveMouse(x, y);
    });

    ipcMain.handle('automation:getMousePosition', async () => {
      return await this.server.getMousePosition();
    });

    ipcMain.handle('automation:clickMouse', async (_, button: 'left' | 'right' | 'middle', durationMs?: number) => {
      return await this.server.clickMouse(button, durationMs);
    });

    ipcMain.handle('automation:doubleClickMouse', async () => {
      return await this.server.doubleClickMouse();
    });

    ipcMain.handle('automation:scrollMouse', async (_, amount: number) => {
      return await this.server.scrollMouse(amount);
    });

    ipcMain.handle('automation:dragMouse', async (_, fromX: number, fromY: number, toX: number, toY: number) => {
      return await this.server.dragMouse(fromX, fromY, toX, toY);
    });

    ipcMain.handle('automation:typeText', async (_, text: string) => {
      return await this.server.typeText(text);
    });

    ipcMain.handle('automation:pressKey', async (_, key: string, durationMs?: number) => {
      return await this.server.pressKey(key, durationMs);
    });
  }
}
