import { container } from '../../../../core/di/container.renderer.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class SocketController {
  constructor(private readonly logger: UILoggerService) {}

  public async connect(url: string): Promise<void> {
    this.logger.log(`[Socket.io] Connecting to ${url}...`);
    try {
      const socket = container.get<any>('SocketClient');
      socket.connect(url);
      socket.on('connect', () => this.logger.log(`[Socket.io] Connected!`));
      socket.on('disconnect', () => this.logger.log(`[Socket.io] Disconnected.`, true));
      socket.on('message', (data: any) => this.logger.log(`[Socket Received] message: ${JSON.stringify(data)}`));
    } catch (err: any) {
      this.logger.log(`Socket Error: ${err.message}`, true);
    }
  }

  public emit(event: string, data: any): void {
    try {
      const socket = container.get<any>('SocketClient');
      socket.emit(event, data);
      this.logger.log(`[Socket Emit] ${event}: ${JSON.stringify(data)}`);
    } catch (err: any) {
      this.logger.log(`Socket Error: ${err.message}`, true);
    }
  }

  public listen(event: string, maxCount: number): void {
    let currentCount = 0;
    try {
      const socket = container.get<any>('SocketClient');
      socket.off(event);
      socket.on(event, (data: any) => {
        currentCount++;
        this.logger.log(`[Socket Received #${currentCount}] ${event}: ${JSON.stringify(data)}`);
        if (currentCount >= maxCount) socket.off(event);
      });
    } catch (err: any) {
      this.logger.log(`Socket Error: ${err.message}`, true);
    }
  }

  // --- Socket.io Server Methods ---

  public async startServer(port: number): Promise<void> {
    const api = (window as any).electronAPI;
    if (!api?.socketServer) return;

    this.logger.log(`[Socket Server] Starting on port ${port}...`);
    try {
      api.socketServer.onStatus((msg: string) => this.logger.log(`[Socket Server Status] ${msg}`));
      api.socketServer.onData((res: { clientId: string, event: string, data: string }) => {
        this.logger.log(`[Socket Server Received] From ${res.clientId} | Event: ${res.event} | Data: ${res.data}`);
      });

      const result = await api.socketServer.listen(port);
      if (!result.success) throw new Error(result.error);
    } catch (err: any) {
      this.logger.log(`Socket Server Error: ${err.message}`, true);
    }
  }

  public stopServer(): void {
    const api = (window as any).electronAPI;
    if (api?.socketServer) {
      api.socketServer.close();
      this.logger.log('[Socket Server] Server stopped.');
    }
  }

  public broadcast(event: string, data: any): void {
    const api = (window as any).electronAPI;
    if (api?.socketServer) {
      api.socketServer.broadcast(event, data);
      this.logger.log(`[Socket Server] ▶ Broadcast | Event: ${event} | Data: ${JSON.stringify(data)}`);
    }
  }

  public disconnect(): void {
    try {
      container.get<any>('SocketClient').disconnect();
      this.logger.log(`[Socket.io] Disconnected.`);
    } catch (err: any) {
      this.logger.log(`Socket Error: ${err.message}`, true);
    }
  }
}
