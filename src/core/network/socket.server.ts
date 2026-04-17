import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';

/**
 * Socket.io Server (Node.js 전용)
 * HTTP 서버를 기반으로 Socket.io 실시간 통신 서버를 운영합니다.
 */
export class SocketServer {
  private io: Server | null = null;
  private httpServer: HttpServer | null = null;
  private connections: Map<string, Socket> = new Map();

  /**
   * 서버를 시작합니다.
   */
  public listen(port: number, onEvent: (clientId: string, event: string, data: any) => void, onStatus: (msg: string) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.io) this.close();

        this.httpServer = createServer();
        this.io = new Server(this.httpServer, {
          cors: {
            origin: "*", // 모든 오리진 허용 (테스트용)
            methods: ["GET", "POST"]
          }
        });

        this.io.on('connection', (socket: Socket) => {
          const clientId = socket.id;
          this.connections.set(clientId, socket);
          onStatus(`Socket.io Client connected: ${clientId}`);

          // 모든 이벤트 수신 대기 (any event listener)
          socket.onAny((event, ...args) => {
            onEvent(clientId, event, args.length > 1 ? args : args[0]);
          });

          socket.on('disconnect', () => {
            this.connections.delete(clientId);
            onStatus(`Socket.io Client disconnected: ${clientId}`);
          });

          socket.on('error', (err) => {
            onStatus(`Socket error (${clientId}): ${err.message}`);
          });
        });

        this.httpServer.listen(port, () => {
          onStatus(`Socket.io Server started on port ${port}`);
          resolve();
        });

        this.httpServer.on('error', (err) => {
          onStatus(`HTTP Server error: ${err.message}`);
          reject(err);
        });

      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * 특정 클라이언트에게 이벤트를 전송합니다.
   */
  public emit(clientId: string, event: string, data: any): boolean {
    const socket = this.connections.get(clientId);
    if (socket) {
      socket.emit(event, data);
      return true;
    }
    return false;
  }

  /**
   * 모든 연결된 클라이언트에게 이벤트를 전송합니다. (Broadcast)
   */
  public broadcast(event: string, data: any): void {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  /**
   * 서버를 종료합니다.
   */
  public close(): void {
    if (this.io) {
      this.io.close();
      this.io = null;
    }
    if (this.httpServer) {
      this.httpServer.close();
      this.httpServer = null;
    }
    this.connections.clear();
  }

  public getConnectedClients(): string[] {
    return Array.from(this.connections.keys());
  }
}
