import { SocketRepository } from '../../../data/network/socket/socket.repository';

/**
 * SocketViewModel: UI 상태 관리 및 서버/클라이언트 로직 통합
 */
export class SocketViewModel {
  public get isServerRunning(): boolean {
    return this.isServerRunningState;
  }

  public get isClientConnecting(): boolean {
    return this.isClientConnected;
  }

  // 기존 private 변수명을 변경하여 getter와 충돌 방지
  private isServerRunningState: boolean = false;
  private isClientConnected: boolean = false;
  private onLogCallback: (msg: string) => void = () => {};

  constructor(private readonly repository: SocketRepository) {
    // 데스크톱 환경에서만 서버 수신 메시지 리스너 등록
    if (this.repository.isDesktop) {
      this.repository.onServerReceived((payload: any) => {
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

  // --- 서버 기능 ---
  public async toggleServer(port: number): Promise<void> {
    if (this.isServerRunningState) {
      await this.repository.stopServer();
      this.isServerRunningState = false;
      this.log('Server Stopped');
    } else {
      await this.repository.startServer(port);
      this.isServerRunningState = true;
      this.log(`Server Started on port ${port}`);
    }
  }

  public async broadcast(event: string, data: any): Promise<void> {
    await this.repository.broadcast(event, data);
    this.log(`Broadcast [${event}]: ${JSON.stringify(data)}`);
  }

  public async subscribeServerEvent(event: string): Promise<void> {
    await this.repository.listenServerEvent(event);
    this.log(`Server now listening for [${event}]`);
  }

  // --- 클라이언트 기능 ---
  public async toggleClient(url: string): Promise<void> {
    if (this.isClientConnected) {
      this.repository.disconnect();
      this.isClientConnected = false;
      this.log(`Client Disconnected`);
    } else {
      this.repository.connect(url);
      this.isClientConnected = true;
      this.log(`Client Connected to ${url}`);
    }
  }

  public subscribeClientEvent(event: string): void {
    if (!this.isClientConnected) {
      this.log('Client not connected');
      return;
    }
    this.repository.on(event, (data: any) => {
      this.log(`Received [${event}]: ${JSON.stringify(data)}`);
    });
    this.log(`Client now listening for [${event}]`);
  }

  public sendMessage(event: string, data: any): void {
    this.repository.send(event, data);
    this.log(`Sent [${event}]: ${JSON.stringify(data)}`);
  }

  public getStatus() {
    return {
      isServerRunning: this.isServerRunning,
      isClientConnected: this.isClientConnected
    };
  }
}
