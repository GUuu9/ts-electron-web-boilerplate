import { TcpRepository } from '../../../../data/ipc/network/tcp/tcp.repository.js';

export class TcpService {
  constructor(private repository: TcpRepository) {}

  public get isDesktop(): boolean { return this.repository.isDesktop; }

  public async startServer(port: number): Promise<void> { await this.repository.startServer(port); }
  public async stopServer(): Promise<void> { await this.repository.stopServer(); }
  public async serverSend(clientId: string, data: string): Promise<void> { await this.repository.serverSend(clientId, data); }
  public async serverBroadcast(data: string): Promise<void> { await this.repository.serverBroadcast(data); }

  public async connect(host: string, port: number): Promise<void> { await this.repository.connect(host, port); }
  public async disconnect(): Promise<void> { await this.repository.disconnect(); }
  public async clientSend(data: string): Promise<void> { await this.repository.clientSend(data); }

  public onServerConnected(callback: (clientId: string) => void) { this.repository.onServerConnected(callback); }
  public onServerDisconnected(callback: (clientId: string) => void) { this.repository.onServerDisconnected(callback); }
  public onServerData(callback: (data: { clientId: string, data: string }) => void) { this.repository.onServerData(callback); }
  public onClientConnected(callback: () => void) { this.repository.onClientConnected(callback); }
  public onClientDisconnected(callback: () => void) { this.repository.onClientDisconnected(callback); }
  public onClientData(callback: (data: string) => void) { this.repository.onClientData(callback); }
}
