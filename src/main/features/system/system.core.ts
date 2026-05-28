import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { SystemServer } from './system.server.js';

/**
 * System Core 모듈
 * 시스템 정보 관련 IPC 핸들러를 등록합니다.
 */
export class SystemCoreModule implements BackendModule {
  private readonly server: SystemServer;

  constructor() {
    this.server = new SystemServer();
  }

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('system-get-status', () => {
      return this.server.getStatus();
    });
  }
}
