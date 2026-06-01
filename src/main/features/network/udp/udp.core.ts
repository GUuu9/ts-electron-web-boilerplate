import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../../core/backend-module.js';
import { UdpService } from './udp.server.js';

/**
 * UdpCoreModule (Backend)
 */
export class UdpCoreModule implements BackendModule {
  private udpService = new UdpService();

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('udp:bind', async (_, port: number) => {
      this.udpService.bind(port, (msg, rinfo) => {
        mainWindow?.webContents.send('udp:onData', { msg, rinfo });
      });
    });

    ipcMain.handle('udp:send', async (_, { msg, port, address }) => {
      this.udpService.send(msg, port, address);
    });

    ipcMain.handle('udp:close', async () => {
      this.udpService.close();
    });
  }
}
