import type { UILoggerService } from '../../core/ui-logger.service.js';

export class TcpUdpController {
  constructor(private readonly logger: UILoggerService) {}

  private get electronAPI() {
    return (window as any).electronAPI;
  }

  public async testTcp(host: string, port: number, msg: string): Promise<void> {
    if (!this.electronAPI?.tcp) {
      this.logger.log('[TCP] Desktop 환경이 아니거나 API가 로드되지 않았습니다.', true);
      return;
    }

    this.logger.log(`[TCP] Connecting to ${host}:${port}...`);
    try {
      const result = await this.electronAPI.tcp.connect(host, port);
      if (!result.success) throw new Error(result.error);

      this.logger.log('[TCP] Connected successfully!');
      this.electronAPI.tcp.onData((data: string) => this.logger.log(`[TCP Received] ${data}`));
      this.electronAPI.tcp.send(msg);
      this.logger.log(`[TCP Sent] ${msg}`);
    } catch (err: any) {
      this.logger.log(`TCP Error: ${err.message}`, true);
    }
  }

  // --- TCP Server Methods ---
  
  public async startTcpServer(port: number): Promise<void> {
    if (!this.electronAPI?.tcpServer) return;

    this.logger.log(`[TCP Server] Attempting to start on port ${port}...`);
    try {
      this.electronAPI.tcpServer.onStatus((msg: string) => this.logger.log(`[TCP Server Status] ${msg}`));
      this.electronAPI.tcpServer.onData((res: { clientId: string, data: string }) => {
        this.logger.log(`[TCP Server Received] From ${res.clientId}: ${res.data}`);
      });

      const result = await this.electronAPI.tcpServer.listen(port);
      if (!result.success) throw new Error(result.error);
    } catch (err: any) {
      this.logger.log(`TCP Server Error: ${err.message}`, true);
    }
  }

  public stopTcpServer(): void {
    if (this.electronAPI?.tcpServer) {
      this.electronAPI.tcpServer.close();
      this.logger.log('[TCP Server] Server stopped.');
    }
  }

  public async sendToClient(clientId: string, msg: string): Promise<void> {
    if (this.electronAPI?.tcpServer) {
      this.electronAPI.tcpServer.send(clientId, msg);
      this.logger.log(`[TCP Server Sent] to ${clientId}: ${msg}`);
    }
  }

  public broadcastToClients(msg: string): void {
    if (this.electronAPI?.tcpServer) {
      this.electronAPI.tcpServer.broadcast(msg);
      this.logger.log(`[TCP Server Broadcast] ${msg}`);
    }
  }

  public async testUdp(host: string, port: number, msg: string): Promise<void> {
    if (!this.electronAPI?.udp) {
      this.logger.log('[UDP] Desktop 환경이 아니므로 UDP를 지원하지 않습니다.', true);
      return;
    }

    this.logger.log(`[UDP] Sending to ${host}:${port}...`);
    try {
      const result = await this.electronAPI.udp.send(msg, port, host);
      if (!result.success) throw new Error(result.error);
      this.logger.log(`[UDP Sent] ${msg}`);
      this.electronAPI.udp.onData((data: any) => {
        this.logger.log(`[UDP Received from ${data.address}:${data.port}] ${data.message}`);
      });
    } catch (err: any) {
      this.logger.log(`UDP Error: ${err.message}`, true);
    }
  }

  public async bindUdp(port: number): Promise<void> {
    if (!this.electronAPI?.udp) return;

    this.logger.log(`[UDP] Binding to port ${port}...`);
    try {
      const result = await this.electronAPI.udp.bind(port);
      if (!result.success) throw new Error(result.error);
      this.logger.log(`[UDP] Now listening on port ${port}`);
      this.electronAPI.udp.onData((data: any) => {
        this.logger.log(`[UDP Received] From ${data.address}:${data.port} -> ${data.message}`);
      });
    } catch (err: any) {
      this.logger.log(`UDP Bind Error: ${err.message}`, true);
    }
  }

  public closeUdp(): void {
    if (this.electronAPI?.udp) {
      this.electronAPI.udp.close();
      this.logger.log('[UDP] Stop listening request sent. Socket closed.');
    }
  }
}
