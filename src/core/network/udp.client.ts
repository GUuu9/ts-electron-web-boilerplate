import * as dgram from 'dgram';

/**
 * UDP 통신을 담당하는 클라이언트 (Node.js 전용)
 */
export class UdpClient {
  private client: dgram.Socket;

  constructor() {
    this.client = dgram.createSocket('udp4');
  }

  /**
   * 데이터를 전송합니다.
   * @param message 전송할 메시지
   * @param port 대상 포트
   * @param host 대상 주소
   */
  public send(message: string | Buffer, port: number, host: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.send(message, port, host, (err) => {
        if (err) {
          // console.error('UDP Send Error:', err);
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 데이터 수신 시 콜백을 등록합니다.
   */
  public onMessage(callback: (msg: Buffer, rinfo: dgram.RemoteInfo) => void): void {
    this.client.on('message', callback);
  }

  /**
   * 클라이언트를 종료합니다.
   */
  public close(): void {
    this.client.close();
  }
}
