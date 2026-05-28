import { SocketClient } from '../../../../shared/socket-client/socket.client.js';

/**
 * SocketRepository (Data Layer)
 */
export class SocketRepository {
  constructor(private readonly socketClient: SocketClient) {}

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
