import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { FileServer } from './file.server.js';

/**
 * File Core 모듈
 */
export class FileCoreModule implements BackendModule {
  private readonly server: FileServer;

  constructor() {
    this.server = new FileServer();
  }

  public setupHandlers(_mainWindow: BrowserWindow | null): void {
    ipcMain.handle('file-read', (_, path: string) => this.server.readFile(path));
    ipcMain.handle('file-write', (_, path: string, content: string) => this.server.writeFile(path, content));
    ipcMain.handle('file-open-dialog', () => this.server.showOpenDialog());
  }
}
