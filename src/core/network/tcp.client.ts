import * as net from 'net';

/**
 * TCP 통신을 담당하는 클라이언트 (Node.js 전용)
 * Electron 메인 프로세스에서만 사용 가능합니다.
 */
export class TcpClient {
  private client: net.Socket | null = null;

  /**
   * TCP 서버에 연결합니다.
   * @param host 서버 주소
   * @param port 포트 번호
   */
  public connect(host: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client = new net.Socket();

      this.client.connect(port, host, () => {
        // console.log(`Connected to TCP server at ${host}:${port}`);
        resolve();
      });

      this.client.on('error', (err) => {
        // console.error('TCP Connection Error:', err);
        reject(err);
      });
    });
  }

  /**
   * 데이터를 전송합니다.
   * @param data 전송할 데이터
   */
  public send(data: string | Buffer): void {
    if (this.client) {
      this.client.write(data);
    }
  }

  /**
   * 데이터 수신 시 콜백을 등록합니다.
   */
  public onData(callback: (data: Buffer) => void): void {
    if (this.client) {
      this.client.on('data', callback);
    }
  }

  /**
   * 연결을 해제합니다.
   */
  public disconnect(): void {
    if (this.client) {
      this.client.destroy();
      this.client = null;
    }
  }
}
