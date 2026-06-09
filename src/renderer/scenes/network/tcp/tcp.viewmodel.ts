import { TcpRepository } from '../../../data/network/tcp/tcp.repository.js';

/**
 * TcpViewModel (ViewModel)
 */
export class TcpViewModel {
  public isServerRunning: boolean = false;
  public isClientConnected: boolean = false;
  private onLogCallback: (msg: string) => void = () => {};

  constructor(private readonly repository: TcpRepository) {
    this.initEventListeners();
  }

  private initEventListeners() {
    if (!this.repository.isDesktop) return;

    // Server Events
    this.repository.onServerConnected((clientId) => {
      this.log(`[Server] Client connected: ${clientId}`);
    });
    this.repository.onServerDisconnected((clientId) => {
      this.log(`[Server] Client disconnected: ${clientId}`);
    });
    this.repository.onServerData(({ clientId, data }) => {
      this.log(`[Server Received] From ${clientId}: ${data}`);
    });

    // Client Events
    this.repository.onClientConnected(() => {
      this.isClientConnected = true;
      this.log(`[Client] Connected to server`);
    });
    this.repository.onClientDisconnected(() => {
      this.isClientConnected = false;
      this.log(`[Client] Disconnected from server`);
    });
    this.repository.onClientData((data) => {
      this.log(`[Client Received] From Server: ${data}`);
    });
  }

  public setLogCallback(callback: (msg: string) => void) {
    this.onLogCallback = callback;
  }

  private log(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.onLogCallback(`[${timestamp}] ${msg}`);
  }

  // --- Server Actions ---
  public async toggleServer(port: number): Promise<void> {
    if (this.isServerRunning) {
      await this.repository.stopServer();
      this.isServerRunning = false;
      this.log('[Server] Stopped');
    } else {
      await this.repository.startServer(port);
      this.isServerRunning = true;
      this.log(`[Server] Started on port ${port}`);
    }
  }

  public async serverBroadcast(data: string): Promise<void> {
    await this.repository.serverBroadcast(data);
    this.log(`[Server Sent] Broadcast: ${data}`);
  }

  // --- Client Actions ---
  public async toggleClient(host: string, port: number): Promise<void> {
    if (this.isClientConnected) {
      await this.repository.disconnect();
    } else {
      await this.repository.connect(host, port);
    }
  }

  public async clientSend(data: string): Promise<void> {
    await this.repository.clientSend(data);
    this.log(`[Client Sent] To Server: ${data}`);
  }
}
