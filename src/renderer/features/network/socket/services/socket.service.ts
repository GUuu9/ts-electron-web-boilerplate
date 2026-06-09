import { SocketRepository } from '../../../../../data/ipc/network/socket/socket.repository.js';

export class SocketService {
  constructor(private repository: SocketRepository) {}

  public get isDesktop(): boolean { return this.repository.isDesktop; }

  public async startServer(port: number): Promise<void> { await this.repository.startServer(port); }
  public async stopServer(): Promise<void> { await this.repository.stopServer(); }
  public async broadcast(event: string, data: any): Promise<void> { await this.repository.broadcast(event, data); }
  public async listenServerEvent(event: string): Promise<void> { await this.repository.listenServerEvent(event); }
  public onServerReceived(callback: (data: any) => void) { return this.repository.onServerReceived(callback); }

  public connect(url: string): void { this.repository.connect(url); }
  public send(event: string, data: any): void { this.repository.send(event, data); }
  public on(event: string, callback: (data: any) => void): void { this.repository.on(event, callback); }
  public disconnect(): void { this.repository.disconnect(); }
}
