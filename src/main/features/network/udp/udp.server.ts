import * as dgram from 'dgram';

/**
 * UdpServer (Backend Service)
 * 실제 OS 자원을 제어하는 UDP 통신 로직
 */
export class UdpServer {
  private socket: dgram.Socket | null = null;

  public bind(port: number, onMessage: (msg: Buffer, remoteInfo: dgram.RemoteInfo) => void) {
    this.socket = dgram.createSocket('udp4');
    this.socket.on('message', onMessage);
    this.socket.bind(port);
  }

  public send(msg: string, port: number, address: string) {
    const buffer = Buffer.from(msg);
    this.socket?.send(buffer, port, address);
  }

  public close() {
    this.socket?.close();
    this.socket = null;
  }
}
