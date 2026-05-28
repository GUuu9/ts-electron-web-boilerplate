import { ipcMain, type BrowserWindow, dialog } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { LoggerService } from './logger.service.js';

/**
 * Logger Core 모듈
 */
export class LoggerCoreModule implements BackendModule {
  private readonly logger: LoggerService;

  constructor() {
    this.logger = new LoggerService();
  }

  public setupHandlers(_mainWindow: BrowserWindow | null): void {
    ipcMain.handle('log-select-file', async () => {
      const { canceled, filePath } = await dialog.showSaveDialog({
        title: '로그 파일 선택',
        defaultPath: 'app.log'
      });
      if (!canceled && filePath) {
        this.logger.setLogPath(filePath);
        return filePath;
      }
      return null;
    });

    ipcMain.handle('log-message', (_, level, message) => {
      this.logger.log(level, message);
    });
  }
}
