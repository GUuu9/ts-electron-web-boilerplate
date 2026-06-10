import { SocketSceneService } from './socketTest.service.js';
import { SocketState } from './socket.state.js';

/**
 * SocketViewModel: UI 상태 관리 및 서버/클라이언트 로직 통합
 */
export class SocketViewModel {
  public readonly state = new SocketState();
  private onLogCallback: (msg: string) => void = () => {};

  constructor(private readonly service: SocketSceneService) {
    // 데스크톱 환경에서만 서버 수신 메시지 리스너 등록
    if (this.service.isDesktop) {
      this.service.onServerReceived((payload: any) => {
        const { event, socketId, data } = payload;
        this.log(`[Server Received] Event: ${event}, Client: ${socketId}, Data: ${JSON.stringify(data)}`);
      });
    }
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

  // --- 서버 기능 ---
  public async toggleServer(port: number): Promise<void> {
    try {
      if (this.state.isServerRunning) {
        await this.service.stopServer();
        this.state.isServerRunning = false;
        this.log('Server Stopped');
      } else {
        await this.service.startServer(port);
        this.state.isServerRunning = true;
        this.log(`Server Started on port ${port}`);
      }
    } catch (e) {
      this.log(`Server Toggle Error: ${e}`);
    }
  }

  public async broadcast(event: string, data: any): Promise<void> {
    try {
      await this.service.broadcast(event, data);
      this.log(`Broadcast [${event}]: ${JSON.stringify(data)}`);
    } catch (e) {
      this.log(`Broadcast Error: ${e}`);
    }
  }

  public async subscribeServerEvent(event: string): Promise<void> {
    try {
      await this.service.listenServerEvent(event);
      this.log(`Server now listening for [${event}]`);
    } catch (e) {
      this.log(`Subscribe Server Error: ${e}`);
    }
  }

  // --- 클라이언트 기능 ---
  public async toggleClient(url: string): Promise<void> {
    try {
      if (this.state.isClientConnected) {
        this.service.disconnect();
        this.state.isClientConnected = false;
        this.log(`Client Disconnected`);
      } else {
        this.service.connect(url);
        this.state.isClientConnected = true;
        this.log(`Client Connected to ${url}`);
      }
    } catch (e) {
      this.log(`Client Toggle Error: ${e}`);
    }
  }

  public subscribeClientEvent(event: string): void {
    if (!this.state.isClientConnected) {
      this.log('Client not connected');
      return;
    }
    this.service.on(event, (data: any) => {
      this.log(`Received [${event}]: ${JSON.stringify(data)}`);
    });
    this.log(`Client now listening for [${event}]`);
  }

  public sendMessage(event: string, data: any): void {
    this.service.send(event, data);
    this.log(`Sent [${event}]: ${JSON.stringify(data)}`);
  }

  public getStatus() {
    return {
      isServerRunning: this.state.isServerRunning,
      isClientConnected: this.state.isClientConnected
    };
  }
}
