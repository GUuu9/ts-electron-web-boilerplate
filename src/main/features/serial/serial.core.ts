import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { SerialServer } from './serial.server.js';

/**
 * Serial Core 모듈
 */
export class SerialCoreModule implements BackendModule {
  private readonly server: SerialServer;

  constructor() {
    this.server = new SerialServer();
  }

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('serial-list-ports', async () => {
      return await this.server.listPorts();
    });

    ipcMain.handle('serial-open', async (_, path: string, baudRate: number) => {
      return await this.server.openPort(path, baudRate, (data) => {
        mainWindow?.webContents.send('serial-data', { path, data });
      });
    });

    ipcMain.handle('serial-close', async (_, path: string) => {
      return await this.server.closePort(path);
    });

    ipcMain.handle('serial-write', async (_, path: string, data: string) => {
      return await this.server.write(path, data);
    });
  }
}
