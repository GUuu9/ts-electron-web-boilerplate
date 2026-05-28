import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { PersistenceServer } from './persistence.server.js';

/**
 * Persistence Core 모듈
 */
export class PersistenceCoreModule implements BackendModule {
  private readonly server: PersistenceServer;

  constructor() {
    this.server = new PersistenceServer();
  }

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('persistence-save', async (_, key: string, value: any) => {
      await this.server.save(key, value);
      return { success: true };
    });

    ipcMain.handle('persistence-load', async (_, key: string) => {
      return await this.server.load(key);
    });
  }
}
