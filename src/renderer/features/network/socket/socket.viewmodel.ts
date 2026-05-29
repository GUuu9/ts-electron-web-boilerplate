import { SocketRepository } from '../../../data/network/socket/socket.repository';

/**
 * SocketViewModel: UI 상태 관리 및 서버/클라이언트 로직 통합
 */
export class SocketViewModel {
  public get isServerRunning(): boolean {
    return this.isServerRunningState;
  }

  // 기존 private 변수명을 변경하여 getter와 충돌 방지
  private isServerRunningState: boolean = false;
  private isClientConnected: boolean = false;
  private onLogCallback: (msg: string) => void = () => {};

  constructor(private readonly repository: SocketRepository) {}

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

  // --- 클라이언트 기능 ---
  public connect(url: string): void {
    this.repository.connect(url);
    this.isClientConnected = true;
    this.log(`Client Connected to ${url}`);
    
    // 수신 이벤트 로그 등록 (예시로 'message' 이벤트)
    this.repository.on('message', (data: any) => {
      this.log(`Received [message]: ${JSON.stringify(data)}`);
    });
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
