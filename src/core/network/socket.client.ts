import { io, Socket } from 'socket.io-client';

/**
 * Socket.io 통신을 담당하는 클라이언트
 * 실시간 양방향 이벤트를 처리합니다.
 */
export class SocketClient {
  private socket: Socket | null = null;

  /**
   * 서버에 연결합니다.
   * @param url 소켓 서버 주소
   */
  public connect(url: string): void {
    this.socket = io(url);

    this.socket.on('connect', () => {
      // console.log('Connected to Socket.io server:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      // console.log('Disconnected from Socket.io server');
    });
  }

  /**
   * 이벤트를 전송(Emit)합니다.
   * @param event 이벤트명
   * @param data 전송할 데이터
   */
  public emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  /**
   * 이벤트 수신(Listen) 시 콜백을 등록합니다.
   * @param event 이벤트명
   * @param callback 처리할 함수
   */
  public on(event: string, callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * 연결을 해제합니다.
   */
  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
