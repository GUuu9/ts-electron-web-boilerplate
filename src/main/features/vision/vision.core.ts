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
    ipcMain.handle('vision:processScreen', async () => {
      return await this.server.processScreen();
    });

    ipcMain.handle('vision:findImage', async (_, templatePath: string, similarity: number) => {
      return await this.server.findImage(templatePath, similarity);
    });

    ipcMain.handle('vision:processImageFile', async (_, filePath: string) => {
      return await this.server.processImageFile(filePath);
    });

    ipcMain.handle('vision:captureRegion', async () => {
      return await this.server.captureRegion();
    });
  }
}
