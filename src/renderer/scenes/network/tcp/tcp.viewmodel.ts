import { TcpSceneService } from './tcpTest.service.js';
import { TcpState } from './tcp.state.js';

/**
 * TcpViewModel (ViewModel)
 */
export class TcpViewModel {
  public readonly state = new TcpState();
  private onLogCallback: (msg: string) => void = () => {};

  constructor(private readonly service: TcpSceneService) {
    this.initEventListeners();
  }

  private initEventListeners() {
    if (!this.service.isDesktop) return;

    // Server Events
    this.service.onServerConnected((clientId) => {
      this.log(`[Server] Client connected: ${clientId}`);
    });
    this.service.onServerDisconnected((clientId) => {
      this.log(`[Server] Client disconnected: ${clientId}`);
    });
    this.service.onServerData(({ clientId, data }) => {
      this.log(`[Server Received] From ${clientId}: ${data}`);
    });

    // Client Events
    this.service.onClientConnected(() => {
      this.state.isClientConnected = true;
      this.log(`[Client] Connected to server`);
    });
    this.service.onClientDisconnected(() => {
      this.state.isClientConnected = false;
      this.log(`[Client] Disconnected from server`);
    });
    this.service.onClientData((data) => {
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

  public get isServerRunning() { return this.state.isServerRunning; }
  public get isClientConnected() { return this.state.isClientConnected; }

  // --- Server Actions ---
  public async toggleServer(port: number): Promise<void> {
    try {
      if (this.state.isServerRunning) {
        await this.service.stopServer();
        this.state.isServerRunning = false;
        this.log('[Server] Stopped');
      } else {
        await this.service.startServer(port);
        this.state.isServerRunning = true;
        this.log(`[Server] Started on port ${port}`);
      }
    } catch(e) {
      this.log(`[Server] Toggle Error: ${e}`);
    }
  }

  public async serverBroadcast(data: string): Promise<void> {
    try {
      await this.service.serverBroadcast(data);
      this.log(`[Server Sent] Broadcast: ${data}`);
    } catch(e) {
      this.log(`[Server] Broadcast Error: ${e}`);
    }
  }

  // --- Client Actions ---
  public async toggleClient(host: string, port: number): Promise<void> {
    try {
      if (this.state.isClientConnected) {
        await this.service.disconnect();
      } else {
        await this.service.connect(host, port);
      }
    } catch(e) {
      this.log(`[Client] Toggle Error: ${e}`);
    }
  }

  public async clientSend(data: string): Promise<void> {
    try {
      await this.service.clientSend(data);
      this.log(`[Client Sent] To Server: ${data}`);
    } catch(e) {
      this.log(`[Client] Send Error: ${e}`);
    }
  }
}
