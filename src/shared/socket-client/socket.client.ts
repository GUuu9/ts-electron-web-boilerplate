import { io, Socket } from 'socket.io-client';

/**
 * SocketClient (Model/Service)
 */
export class SocketClient {
  private socket: Socket | null = null;

  public connect(url: string): void {
    this.socket = io(url);
    this.socket.on('connect', () => console.log('[Socket] Connected:', this.socket?.id));
  }

  public emit(event: string, data: any): void {
    this.socket?.emit(event, data);
  }

  public on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }

  public disconnect(): void {
    this.socket?.disconnect();
  }
}
