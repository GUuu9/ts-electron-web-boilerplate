import * as dgram from 'dgram';

/**
 * UdpService (Backend Service)
 */
export class UdpService {
  private socket: dgram.Socket | null = null;

  // UDP는 Connectionless이므로 Server/Client 구분이 모호하지만, 
  // 기능적으로 Bind(수신대기)와 Send(발신)로 분리합니다.
  public bind(port: number, onData: (msg: string, remoteInfo: dgram.RemoteInfo) => void) {
    if (this.socket) this.socket.close();
    
    this.socket = dgram.createSocket('udp4');
    this.socket.on('message', (msg, rinfo) => {
      onData(msg.toString(), rinfo);
    });
    this.socket.bind(port, () => {
      console.log(`[UDP] Bound to port ${port}`);
    });
  }

  public send(msg: string, port: number, address: string) {
    if (!this.socket) this.socket = dgram.createSocket('udp4');
    
    const buffer = Buffer.from(msg);
    this.socket.send(buffer, port, address, (err) => {
      if (err) console.error('[UDP] Send error:', err);
    });
  }

  public close() {
    this.socket?.close();
    this.socket = null;
    console.log('[UDP] Socket closed');
  }
}
