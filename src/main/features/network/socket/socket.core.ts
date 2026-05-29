import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../../core/backend-module.js';
import { SocketServer } from './socket.server.js';

/**
 * SocketCore: 백엔드 모듈 구현 및 IPC 핸들러 등록
 */
export class SocketCore implements BackendModule {
  private socketServer = new SocketServer();

  public init() {
    console.log('[SOCKET] SOCKET Feature 초기화');
  }

  setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('socket:startServer', async (_, port: number) => {
      this.socketServer.start(port);
    });

    ipcMain.handle('socket:stopServer', async () => {
      this.socketServer.stop();
    });

    ipcMain.handle('socket:broadcast', async (_, event: string, data: any) => {
      this.socketServer.broadcast(event, data);
    });
  }
}
