import { container } from '../../../../core/di/index.js';
import type { HttpClient, SocketClient } from '../../../../core/network/index.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class NetworkController {
  constructor(private readonly logger: UILoggerService) {}

  // ... (기존 getter 및 메서드 생략)

  public async testSocketConnect(): Promise<void> {
    const url = (document.getElementById('socket-url') as HTMLInputElement)?.value || 'http://localhost:3000';
    this.logger.log(`[Socket.io] Connecting to ${url}...`);

    try {
      const socket = container.get<SocketClient>('SocketClient');
      socket.connect(url);

      socket.on('connect', () => {
        this.logger.log(`[Socket.io] Connected!`);
      });

      socket.on('disconnect', () => {
        this.logger.log(`[Socket.io] Disconnected.`, true);
      });

      // 서버로부터 오는 모든 이벤트를 로깅하기 위한 예시 (서버 구현에 따라 다름)
      socket.on('message', (data: any) => {
        this.logger.log(`[Socket Received] message: ${JSON.stringify(data)}`);
      });
    } catch (err: any) {
      this.logger.log(`Socket Error: ${err.message}`, true);
    }
  }

  public testSocketEmit(): void {
    const event = (document.getElementById('socket-event') as HTMLInputElement)?.value || 'chat message';
    const rawMsg = (document.getElementById('socket-msg') as HTMLTextAreaElement)?.value || '';

    let finalData: any = rawMsg;

    // JSON 파싱 시도
    if (rawMsg.trim().startsWith('{') || rawMsg.trim().startsWith('[')) {
      try {
        finalData = JSON.parse(rawMsg);
        this.logger.log(`[Socket Emit] Sending as JSON Object`);
      } catch (e) {
        this.logger.log(`[Socket Emit] JSON Parse failed, sending as raw string`, true);
        finalData = rawMsg;
      }
    }

    try {
      const socket = container.get<SocketClient>('SocketClient');
      socket.emit(event, finalData);
      this.logger.log(`[Socket Emit] ${event}: ${typeof finalData === 'object' ? JSON.stringify(finalData) : finalData}`);
    } catch (err: any) {
      this.logger.log(`Socket Emit Error: ${err.message}`, true);
    }
  }

  public testSocketListen(): void {
    const event = (document.getElementById('socket-listen-event') as HTMLInputElement)?.value || 'response';
    const maxCount = parseInt((document.getElementById('socket-listen-count') as HTMLInputElement)?.value || '1');
    
    let currentCount = 0;
    this.logger.log(`[Socket.io] Registered listener for "${event}" (Max: ${maxCount})`);

    try {
      const socket = container.get<SocketClient>('SocketClient');
      
      // 기존 동일 이벤트 리스너 제거 (중복 방지)
      socket.off(event);

      socket.on(event, (data: any) => {
        currentCount++;
        this.logger.log(`[Socket Received #${currentCount}] ${event}: ${JSON.stringify(data)}`);

        if (currentCount >= maxCount) {
          this.logger.log(`[Socket.io] Reached max count (${maxCount}). Unregistering listener for "${event}".`);
          socket.off(event);
        }
      });
    } catch (err: any) {
      this.logger.log(`Socket Listen Error: ${err.message}`, true);
    }
  }

  public testSocketDisconnect(): void {
    try {
      const socket = container.get<SocketClient>('SocketClient');
      socket.disconnect();
      this.logger.log(`[Socket.io] Connection closed by user.`);
    } catch (err: any) {
      this.logger.log(`Socket Disconnect Error: ${err.message}`, true);
    }
  }

  // Electron API 접근 유틸리티 (에러 방지용)
  private get electronAPI() {
    return (window as any).electronAPI;
  }

  public async testHttp(): Promise<void> {
    const urlInput = document.getElementById('http-url') as HTMLInputElement;
    const url = urlInput?.value || 'https://jsonplaceholder.typicode.com/todos/1';
    
    this.logger.log(`[HTTP] GET ${url}`);
    try {
      const http = container.get<HttpClient>('HttpClient');
      const res = await http.get(url);
      this.logger.log(`Status: ${res.status}`);
      this.logger.log(`Data: ${JSON.stringify(res.data).substring(0, 100)}...`);
    } catch (err: any) {
      this.logger.log(`HTTP Error: ${err.message}`, true);
    }
  }

  public async testTcp(): Promise<void> {
    const host = (document.getElementById('tcp-host') as HTMLInputElement)?.value || '127.0.0.1';
    const port = parseInt((document.getElementById('tcp-port') as HTMLInputElement)?.value || '8080');
    const msg = (document.getElementById('tcp-msg') as HTMLInputElement)?.value || 'Hello TCP';

    if (!this.electronAPI || !this.electronAPI.tcp) {
      this.logger.log('[TCP] Desktop(Electron) 환경이 감지되지 않았거나 API가 로드되지 않았습니다.', true);
      console.warn('Current window.electronAPI:', this.electronAPI);
      return;
    }

    this.logger.log(`[TCP] Connecting to ${host}:${port}...`);
    try {
      const result = await this.electronAPI.tcp.connect(host, port);
      
      if (!result.success) throw new Error(result.error);

      this.logger.log('[TCP] Connected successfully!');
      
      this.electronAPI.tcp.onData((data: string) => {
        this.logger.log(`[TCP Received] ${data}`);
      });

      this.electronAPI.tcp.send(msg);
      this.logger.log(`[TCP Sent] ${msg}`);
      
    } catch (err: any) {
      this.logger.log(`TCP Error: ${err.message}`, true);
    }
  }

  public async testUdpBind(): Promise<void> {
    const port = parseInt((document.getElementById('udp-bind-port') as HTMLInputElement)?.value || '5001');

    if (!this.electronAPI || !this.electronAPI.udp) return;

    this.logger.log(`[UDP] Binding to port ${port}...`);
    try {
      const result = await this.electronAPI.udp.bind(port);
      if (!result.success) throw new Error(result.error);

      this.logger.log(`[UDP] Now listening on port ${port}`);
      
      this.electronAPI.udp.onData((data: any) => {
        this.logger.log(`[UDP Received] From ${data.address}:${data.port} -> ${data.message}`);
      });
    } catch (err: any) {
      this.logger.log(`UDP Bind Error: ${err.message}`, true);
    }
  }

  public async testUdp(): Promise<void> {
    const host = (document.getElementById('udp-host') as HTMLInputElement)?.value || '127.0.0.1';
    const port = parseInt((document.getElementById('udp-port') as HTMLInputElement)?.value || '5000');
    const msg = (document.getElementById('udp-msg') as HTMLInputElement)?.value || 'Fast Packet';

    if (!this.electronAPI || !this.electronAPI.udp) {
      this.logger.log('[UDP] Desktop 환경이 아니므로 UDP를 지원하지 않습니다.', true);
      return;
    }

    this.logger.log(`[UDP] Sending to ${host}:${port}...`);
    try {
      const result = await this.electronAPI.udp.send(msg, port, host);
      
      if (!result.success) throw new Error(result.error);

      this.logger.log(`[UDP Sent] ${msg}`);
      
      this.electronAPI.udp.onData((data: any) => {
        this.logger.log(`[UDP Received from ${data.address}:${data.port}] ${data.message}`);
      });
      
    } catch (err: any) {
      this.logger.log(`UDP Error: ${err.message}`, true);
    }
  }
}
