import * as net from 'net';

/**
 * TCP Server (Node.js 전용)
 * 특정 포트에서 접속을 대기하고 클라이언트와 데이터를 주고받습니다.
 */
export class TcpServer {
  private server: net.Server | null = null;
  private connections: Map<string, net.Socket> = new Map();

  /**
   * 서버를 시작합니다.
   */
  public listen(port: number, onData: (id: string, data: Buffer) => void, onStatus: (msg: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.server) this.close();

        this.server = net.createServer((socket) => {
          const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
          this.connections.set(clientId, socket);
          onStatus(`Client connected: ${clientId}`);

          socket.on('data', (data) => onData(clientId, data));
          
          socket.on('close', () => {
            this.connections.delete(clientId);
            onStatus(`Client disconnected: ${clientId}`);
          });

          socket.on('error', (err) => {
            onStatus(`Socket error (${clientId}): ${err.message}`);
          });
        });

        this.server.listen(port, () => {
          onStatus(`TCP Server started on port ${port}`);
          resolve();
        });

        this.server.on('error', (err) => {
          onStatus(`Server error: ${err.message}`);
          reject(err);
        });

      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 연결된 특정 클라이언트에게 데이터를 전송합니다.
   */
  public send(clientId: string, message: string): boolean {
    const socket = this.connections.get(clientId);
    if (socket) {
      socket.write(message);
      return true;
    }
    return false;
  }

  /**
   * 모든 클라이언트에게 데이터를 전송합니다. (Broadcast)
   */
  public broadcast(message: string): void {
    this.connections.forEach((socket) => socket.write(message));
  }

  /**
   * 서버를 종료하고 모든 연결을 끊습니다.
   */
  public close(): void {
    if (this.server) {
      this.connections.forEach((socket) => socket.destroy());
      this.connections.clear();
      this.server.close();
      this.server = null;
    }
  }

  public getConnectedClients(): string[] {
    return Array.from(this.connections.keys());
  }
}
