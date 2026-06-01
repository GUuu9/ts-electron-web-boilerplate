/**
 * TcpRepository (Data Layer)
 * 렌더러가 IPC 브릿지를 통해 백엔드의 TCP 기능에 접근하도록 함
 */
export class TcpRepository {
  private get tcp() {
    return (window as any).electronAPI.tcp;
  }

  public get isDesktop(): boolean {
    return !!(window as any).electronAPI?.tcp;
  }

  // --- Server ---
  public async startServer(port: number): Promise<void> {
    if (!this.isDesktop) return;
    await this.tcp.startServer(port);
  }

  public async stopServer(): Promise<void> {
    if (!this.isDesktop) return;
    await this.tcp.stopServer();
  }

  public async serverSend(clientId: string, data: string): Promise<void> {
    if (!this.isDesktop) return;
    await this.tcp.serverSend(clientId, data);
  }

  public async serverBroadcast(data: string): Promise<void> {
    if (!this.isDesktop) return;
    await this.tcp.serverBroadcast(data);
  }

  // --- Client ---
  public async connect(host: string, port: number): Promise<void> {
    if (!this.isDesktop) return;
    await this.tcp.connect(host, port);
  }

  public async disconnect(): Promise<void> {
    if (!this.isDesktop) return;
    await this.tcp.disconnect();
  }

  public async clientSend(data: string): Promise<void> {
    if (!this.isDesktop) return;
    await this.tcp.clientSend(data);
  }

  // --- Events ---
  public onServerConnected(callback: (clientId: string) => void) {
    if (!this.isDesktop) return;
    this.tcp.onServerConnected(callback);
  }

  public onServerDisconnected(callback: (clientId: string) => void) {
    if (!this.isDesktop) return;
    this.tcp.onServerDisconnected(callback);
  }

  public onServerData(callback: (data: { clientId: string, data: string }) => void) {
    if (!this.isDesktop) return;
    this.tcp.onServerData(callback);
  }

  public onClientConnected(callback: () => void) {
    if (!this.isDesktop) return;
    this.tcp.onClientConnected(callback);
  }

  public onClientDisconnected(callback: () => void) {
    if (!this.isDesktop) return;
    this.tcp.onClientDisconnected(callback);
  }

  public onClientData(callback: (data: string) => void) {
    if (!this.isDesktop) return;
    this.tcp.onClientData(callback);
  }
}
