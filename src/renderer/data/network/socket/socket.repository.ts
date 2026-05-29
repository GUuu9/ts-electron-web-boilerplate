import { SocketClient } from '../../../../shared/socket-client/socket.client.js';

/**
 * SocketRepository (Data Layer)
 * 서버 제어(IPC)와 클라이언트 통신(Shared)을 모두 포함합니다.
 */
export class SocketRepository {
  constructor(private readonly socketClient: SocketClient) {}

  // --- 서버 기능 (IPC 통신) ---
  public async startServer(port: number): Promise<void> {
    await (window as any).electronAPI.socket.startServer(port);
  }

  public async stopServer(): Promise<void> {
    await (window as any).electronAPI.socket.stopServer();
  }

  public async broadcast(event: string, data: any): Promise<void> {
    await (window as any).electronAPI.socket.broadcast(event, data);
  }

  // --- 클라이언트 기능 (Shared 서비스 통신) ---
  public connect(url: string): void {
    this.socketClient.connect(url);
  }

  public send(event: string, data: any): void {
    this.socketClient.emit(event, data);
  }

  public on(event: string, callback: (data: any) => void): void {
    this.socketClient.on(event, callback);
  }
}
