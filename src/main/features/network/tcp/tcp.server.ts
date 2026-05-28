import * as net from 'net';

/**
 * TcpServer (Backend Service)
 * 실제 OS 자원을 제어하는 TCP 서버 로직
 */
export class TcpServer {
  private server: net.Server | null = null;

  public listen(port: number, onData: (clientId: string, data: Buffer) => void) {
    this.server = net.createServer((socket) => {
      const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
      socket.on('data', (data) => onData(clientId, data));
    });
    this.server.listen(port);
  }

  public close() {
    this.server?.close();
  }
}
