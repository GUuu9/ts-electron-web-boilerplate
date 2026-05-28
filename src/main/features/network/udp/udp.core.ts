import { ipcMain } from 'electron';
import { BackendModule } from '../../../core/backend-module.js';
import { UdpServer } from './udp.server.js';

/**
 * UdpCoreModule (Backend)
 */
export class UdpCoreModule implements BackendModule {
  private udpServer = new UdpServer();

  public setupHandlers(mainWindow: any) {
    ipcMain.handle('udp-bind', async (_, port: number) => {
      try {
        this.udpServer.bind(port, (msg, remoteInfo) => {
          console.log(`[UDP] Received from ${remoteInfo.address}:${remoteInfo.port}: ${msg.toString()}`);
          mainWindow?.webContents.send('udp-data', { msg: msg.toString(), rinfo: remoteInfo });
        });
        return { success: true };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    });

    ipcMain.handle('udp-send', async (_, { msg, port, address }) => {
      try {
        this.udpServer.send(msg, port, address);
        return { success: true };
      } catch (error) {
        return { success: false, error: (error as Error).message };
      }
    });
  }
}
