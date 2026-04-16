import * as dgram from 'dgram';

/**
 * UDP 통신을 담당하는 클라이언트 (Node.js 전용)
 */
export class UdpClient {
  private client: dgram.Socket | null = null;

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    this.client = dgram.createSocket('udp4');
  }

  /**
   * 데이터를 전송합니다.
   */
  public send(message: string | Buffer, port: number, host: string): Promise<void> {
    if (!this.client) this.initSocket();
    
    return new Promise((resolve, reject) => {
      this.client!.send(message, port, host, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * 특정 포트에서 패킷을 수신 대기합니다.
   */
  public bind(port: number): void {
    // 이미 바인딩된 상태에서 재호출 시 에러가 발생하므로, 소켓을 새로 생성함
    try {
      if (this.client) {
        this.close();
      }
      this.initSocket();
      this.client!.bind(port);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 데이터 수신 시 콜백을 등록합니다.
   */
  public onMessage(callback: (msg: Buffer, rinfo: dgram.RemoteInfo) => void): void {
    if (this.client) {
      this.client.removeAllListeners('message');
      this.client.on('message', callback);
    }
  }

  /**
   * 클라이언트를 종료합니다.
   */
  public close(): void {
    if (this.client) {
      this.client.removeAllListeners();
      try {
        this.client.close();
      } catch (e) {
        // 이미 닫힌 경우 무시
      }
      this.client = null;
    }
  }
}
