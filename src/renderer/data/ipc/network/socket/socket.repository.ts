import { SocketClient } from '../../../../../shared/socket-client/socket.client.js';

/**
 * SocketRepository (Data Layer)
 * 서버 제어(IPC)와 클라이언트 통신(Shared)을 모두 포함합니다.
 */
export class SocketRepository {
  constructor(private readonly socketClient: SocketClient) {}

  /**
   * 데스크톱 전용 기능(Socket Server) 사용 가능 여부 확인
   */
  public get isDesktop(): boolean {
    return !!(window as any).electronAPI?.socket;
  }

  // --- 서버 기능 (IPC 통신) ---
  public async startServer(port: number): Promise<void> {
    if (!this.isDesktop) return;
    await (window as any).electronAPI.socket.startServer(port);
  }

  public async stopServer(): Promise<void> {
    if (!this.isDesktop) return;
    await (window as any).electronAPI.socket.stopServer();
  }

  public async broadcast(event: string, data: any): Promise<void> {
    if (!this.isDesktop) return;
    await (window as any).electronAPI.socket.broadcast(event, data);
  }

  public async listenServerEvent(event: string): Promise<void> {
    if (!this.isDesktop) return;
    await (window as any).electronAPI.socket.listenEvent(event);
  }

  public onServerReceived(callback: (data: any) => void): (() => void) | undefined {
    if (!this.isDesktop) return undefined;
    return (window as any).electronAPI.socket.onServerReceived(callback);
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

  public disconnect(): void {
    this.socketClient.disconnect();
  }
}
