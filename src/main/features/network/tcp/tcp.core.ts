import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../../core/backend-module.js';
import { TcpServer } from './tcp.server.js';

/**
 * TcpCoreModule (Backend)
 * TCP 서버 기능을 관리하는 독립적인 서비스 모듈
 */
export class TcpCoreModule implements BackendModule {
  private tcpServer = new TcpServer();

  public init() {
    console.log('[TCP] TCP Feature 초기화');
  }

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('tcp-server-listen', async (_, port: number) => {
      try {
        this.tcpServer.listen(port, (clientId, data) => {
          console.log(`[TCP] ${clientId}: ${data.toString()}`);
        });
        return { success: true };
      } catch (error) {
        console.error('[TCP] Error:', error);
        return { success: false, error: (error as Error).message };
      }
    });
  }
}
