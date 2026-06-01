import { Server, Socket } from 'socket.io';
import { createServer, Server as HttpServer } from 'http';

/**
 * SocketServer: 실제 Socket.io 서버 로직을 담당합니다.
 */
export class SocketServer {
  private io: Server | null = null;
  private httpServer: HttpServer | null = null;
  private listeners: Map<string, (socketId: string, data: any) => void> = new Map();

  // 서버 활성화
  public start(port: number): void {
    if (this.io) return;

    this.httpServer = createServer();
    this.io = new Server(this.httpServer, {
      cors: { origin: '*' },
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[SocketServer] Client connected: ${socket.id}`);
      
      // 기존에 등록된 모든 리스너를 새 소켓에 적용
      this.listeners.forEach((callback, event) => {
        socket.on(event, (data: any) => {
          callback(socket.id, data);
        });
      });

      socket.on('disconnect', () => {
        console.log(`[SocketServer] Client disconnected: ${socket.id}`);
      });
    });

    this.httpServer.listen(port, () => {
      console.log(`[SocketServer] Listening on port ${port}`);
    });
  }

  // 특정 이벤트 리스너 등록
  public listenEvent(event: string, callback: (socketId: string, data: any) => void): void {
    if (this.listeners.has(event)) return;

    this.listeners.set(event, callback);

    // 현재 연결된 모든 소켓에도 리스너 등록
    if (this.io) {
      this.io.sockets.sockets.forEach((socket) => {
        socket.on(event, (data: any) => {
          callback(socket.id, data);
        });
      });
    }
  }

  // 서버 중지
  public stop(): void {
    this.io?.close();
    this.httpServer?.close();
    this.io = null;
    this.httpServer = null;
    console.log('[SocketServer] Server stopped');
  }

  // 메시지 전송
  public broadcast(event: string, data: any): void {
    this.io?.emit(event, data);
  }
}
