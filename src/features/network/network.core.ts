import { ipcMain, type BrowserWindow } from 'electron';
import { container } from '../../core/di/container.main.js';
import type { TcpClient } from './tcp.client.js';
import type { TcpServer } from './tcp.server.js';
import type { UdpClient } from './udp.client.js';
import type { SocketServer } from './socket.server.js';
import type { CoreFeature } from '../../core/core-feature.js';

/**
 * Network Core Feature
 * TCP, UDP, Socket.io 서버 관련 백엔드 로직을 담당합니다.
 */
export class NetworkCoreFeature implements CoreFeature {
  id = 'network';

  setupHandlers(mainWindow: BrowserWindow | null) {
    const tcpClient = container.get<TcpClient>('TcpClient');
    const tcpServer = container.get<TcpServer>('TcpServer');
    const socketServer = container.get<SocketServer>('SocketServer');
    const udpClient = container.get<UdpClient>('UdpClient');

    // --- TCP Client ---
    ipcMain.handle('tcp-connect', async (_event, host: string, port: number) => {
      try {
        await tcpClient.connect(host, port);
        tcpClient.onData((data) => mainWindow?.webContents.send('tcp-data', data.toString()));
        tcpClient.onClose(() => mainWindow?.webContents.send('tcp-closed'));
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    });
    ipcMain.on('tcp-send', (_, msg) => tcpClient.send(msg));
    ipcMain.on('tcp-disconnect', () => tcpClient.disconnect());

    // --- TCP Server ---
    ipcMain.handle('tcp-server-listen', async (_, port: number) => {
      try {
        await tcpServer.listen(
          port,
          (clientId, data) => mainWindow?.webContents.send('tcp-server-data', { clientId, data: data.toString() }),
          (msg) => mainWindow?.webContents.send('tcp-server-status', msg)
        );
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    });
    ipcMain.on('tcp-server-send', (_, clientId, msg) => tcpServer.send(clientId, msg));
    ipcMain.on('tcp-server-broadcast', (_, msg) => tcpServer.broadcast(msg));
    ipcMain.on('tcp-server-close', () => tcpServer.close());
    ipcMain.handle('tcp-server-clients', () => tcpServer.getConnectedClients());

    // --- Socket.io Server ---
    ipcMain.handle('socket-server-listen', async (_, port: number) => {
      try {
        await socketServer.listen(
          port,
          (clientId, event, data) => mainWindow?.webContents.send('socket-server-data', { clientId, event, data: JSON.stringify(data) }),
          (msg) => mainWindow?.webContents.send('socket-server-status', msg)
        );
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    });
    ipcMain.on('socket-server-emit', (_, clientId, event, data) => socketServer.emit(clientId, event, data));
    ipcMain.on('socket-server-broadcast', (_, event, data) => socketServer.broadcast(event, data));
    ipcMain.on('socket-server-close', () => socketServer.close());
    ipcMain.handle('socket-server-clients', () => socketServer.getConnectedClients());

    // --- UDP ---
    ipcMain.handle('udp-bind', async (_event, port: number) => {
      try {
        udpClient.bind(port);
        udpClient.onMessage((msg, rinfo) => {
          mainWindow?.webContents.send('udp-data', { message: msg.toString(), address: rinfo.address, port: rinfo.port });
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    });
    ipcMain.handle('udp-send', async (_, msg, port, host) => {
      try {
        await udpClient.send(msg, port, host);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    });
    ipcMain.on('udp-close', () => udpClient.close());
  }
}
