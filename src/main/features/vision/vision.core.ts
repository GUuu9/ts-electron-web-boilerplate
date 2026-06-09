import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { VisionServer } from './vision.server.js';

/**
 * VisionCore: 백엔드 모듈 구현 및 IPC 핸들러 등록
 */
export class VisionCore implements BackendModule {
  private server: VisionServer;

  constructor() {
    this.server = new VisionServer();
  }

  public init() {
    console.log('[VISION] Vision Feature 초기화');
  }

  setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('vision:captureScreen', async () => {
      return await this.server.captureScreen();
    });
  }
}
