import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../../core/backend-module.js';
import { TcpService } from './tcp.server.js';

/**
 * TcpCoreModule (Backend)
 * TCP 서버 및 클라이언트 기능을 관리하는 독립적인 서비스 모듈
 */
export class TcpCoreModule implements BackendModule {
  private tcpService = new TcpService();

  public init() {
    console.log('[TCP] TCP Feature 초기화');
  }

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    // --- Server Handlers ---
    ipcMain.handle('tcp:startServer', async (_, port: number) => {
      this.tcpService.startServer(port, 
        (clientId) => mainWindow?.webContents.send('tcp:onServerConnected', clientId),
        (clientId) => mainWindow?.webContents.send('tcp:onServerDisconnected', clientId),
        (clientId, data) => mainWindow?.webContents.send('tcp:onServerData', { clientId, data })
      );
    });

    ipcMain.handle('tcp:stopServer', async () => {
      this.tcpService.stopServer();
    });

    ipcMain.handle('tcp:serverSend', async (_, { clientId, data }) => {
      this.tcpService.serverSend(clientId, data);
    });

    ipcMain.handle('tcp:serverBroadcast', async (_, data: string) => {
      this.tcpService.serverBroadcast(data);
    });

    // --- Client Handlers ---
    ipcMain.handle('tcp:connect', async (_, { host, port }) => {
      this.tcpService.connect(host, port,
        () => mainWindow?.webContents.send('tcp:onClientConnected'),
        () => mainWindow?.webContents.send('tcp:onClientDisconnected'),
        (data) => mainWindow?.webContents.send('tcp:onClientData', data)
      );
    });

    ipcMain.handle('tcp:disconnect', async () => {
      this.tcpService.disconnect();
    });

    ipcMain.handle('tcp:clientSend', async (_, data: string) => {
      this.tcpService.clientSend(data);
    });
  }
}
