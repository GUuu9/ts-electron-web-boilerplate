import { HttpController } from './http.controller.js';
import { SocketController } from './socket.controller.js';
import { TcpUdpController } from './tcp-udp.controller.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class NetworkController {
  constructor(
    private readonly logger: UILoggerService,
    private readonly http: HttpController,
    private readonly socket: SocketController,
    private readonly l4: TcpUdpController
  ) {}

  public async testHttp(): Promise<void> {
    const url = (document.getElementById('http-url') as HTMLInputElement)?.value || 'https://jsonplaceholder.typicode.com/todos/1';
    await this.http.testHttp(url);
  }

  public async testTcp(): Promise<void> {
    const host = (document.getElementById('tcp-host') as HTMLInputElement)?.value || '127.0.0.1';
    const port = parseInt((document.getElementById('tcp-port') as HTMLInputElement)?.value || '8080');
    const msg = (document.getElementById('tcp-msg') as HTMLInputElement)?.value || 'Hello TCP';
    await this.l4.testTcp(host, port, msg);
  }

  // TCP Server Hub Methods
  public async startTcpServer(): Promise<void> {
    const port = parseInt((document.getElementById('tcp-server-port') as HTMLInputElement)?.value || '8888');
    await this.l4.startTcpServer(port);
  }

  public stopTcpServer(): void {
    this.l4.stopTcpServer();
  }

  public broadcastTcpServer(): void {
    const msg = (document.getElementById('tcp-server-msg') as HTMLInputElement)?.value || 'Broadcast from Server';
    this.l4.broadcastToClients(msg);
  }

  public async testUdp(): Promise<void> {
    const host = (document.getElementById('udp-host') as HTMLInputElement)?.value || '127.0.0.1';
    const port = parseInt((document.getElementById('udp-port') as HTMLInputElement)?.value || '5000');
    const msg = (document.getElementById('udp-msg') as HTMLInputElement)?.value || 'Fast Packet';
    await this.l4.testUdp(host, port, msg);
  }

  public async testUdpBind(): Promise<void> {
    const port = parseInt((document.getElementById('udp-bind-port') as HTMLInputElement)?.value || '5001');
    await this.l4.bindUdp(port);
  }

  public testUdpClose(): void {
    const port = (document.getElementById('udp-bind-port') as HTMLInputElement)?.value || 'unknown';
    this.logger.log(`[UDP] Stopping listener on port ${port}...`);
    this.l4.closeUdp();
  }

  public async testSocketConnect(): Promise<void> {
    const url = (document.getElementById('socket-url') as HTMLInputElement)?.value || 'http://localhost:3000';
    await this.socket.connect(url);
  }

  // Socket Server Hub Methods
  public async startSocketServer(): Promise<void> {
    const port = parseInt((document.getElementById('socket-server-port') as HTMLInputElement)?.value || '3000');
    this.logger.log(`[Socket Server] Requesting to start server on port ${port}...`);
    await this.socket.startServer(port);
  }

  public stopSocketServer(): void {
    this.logger.log('[Socket Server] Requesting to stop server...');
    this.socket.stopServer();
  }

  public broadcastSocketServer(): void {
    const event = (document.getElementById('socket-server-event') as HTMLInputElement)?.value || 'broadcast';
    const rawMsg = (document.getElementById('socket-server-msg') as HTMLTextAreaElement)?.value || '';
    
    this.logger.log(`[Socket Server] Requesting broadcast: Event[${event}]`);
    
    let finalData: any = rawMsg;
    if (rawMsg.trim().startsWith('{') || rawMsg.trim().startsWith('[')) {
      try {
        finalData = JSON.parse(rawMsg);
      } catch (e) { 
        this.logger.log(`[Socket Server] JSON Parse failed, sending as string.`, true); 
      }
    }
    this.socket.broadcast(event, finalData);
  }

  public testSocketEmit(): void {
    const event = (document.getElementById('socket-event') as HTMLInputElement)?.value || 'chat message';
    const rawMsg = (document.getElementById('socket-msg') as HTMLTextAreaElement)?.value || '';
    let finalData: any = rawMsg;
    if (rawMsg.trim().startsWith('{') || rawMsg.trim().startsWith('[')) {
      try {
        finalData = JSON.parse(rawMsg);
      } catch (e) { this.logger.log(`[Socket Emit] JSON Parse failed`, true); }
    }
    this.socket.emit(event, finalData);
  }

  public testSocketListen(): void {
    const event = (document.getElementById('socket-listen-event') as HTMLInputElement)?.value || 'response';
    const maxCount = parseInt((document.getElementById('socket-listen-count') as HTMLInputElement)?.value || '1');
    this.socket.listen(event, maxCount);
  }

  public testSocketDisconnect(): void {
    this.socket.disconnect();
  }
}
