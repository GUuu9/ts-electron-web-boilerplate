import { SocketService } from '../../../domains/network/socket/services/socket.service.js';
import { LoggerService } from '../../../domains/logger/services/logger.service.js';

export class SocketSceneService {
  constructor(
    private service: SocketService,
    private loggerService: LoggerService
  ) {}

  public get isDesktop(): boolean { return this.service.isDesktop; }

  public async startServer(port: number): Promise<void> {
    await this.loggerService.log('INFO', `서버 시작 시도: 포트 ${port}`);
    try { await this.service.startServer(port); } catch(e) { await this.loggerService.log('ERROR', `서버 시작 실패: ${e}`); throw e; }
  }

  public async stopServer(): Promise<void> {
    await this.loggerService.log('INFO', '서버 중지 시도');
    try { await this.service.stopServer(); } catch(e) { await this.loggerService.log('ERROR', `서버 중지 실패: ${e}`); throw e; }
  }

  public async broadcast(event: string, data: any): Promise<void> {
    await this.loggerService.log('INFO', `브로드캐스트: ${event}`);
    try { await this.service.broadcast(event, data); } catch(e) { await this.loggerService.log('ERROR', `브로드캐스트 실패: ${e}`); throw e; }
  }

  public async listenServerEvent(event: string): Promise<void> {
    await this.loggerService.log('INFO', `서버 이벤트 리스닝: ${event}`);
    try { await this.service.listenServerEvent(event); } catch(e) { await this.loggerService.log('ERROR', `이벤트 리스닝 실패: ${e}`); throw e; }
  }

  public onServerReceived(callback: (data: any) => void) { return this.service.onServerReceived(callback); }

  public connect(url: string): void {
    this.loggerService.log('INFO', `클라이언트 연결 시도: ${url}`);
    this.service.connect(url);
  }

  public send(event: string, data: any): void {
    this.loggerService.log('INFO', `메시지 전송: ${event}`);
    this.service.send(event, data);
  }

  public on(event: string, callback: (data: any) => void): void {
    this.service.on(event, callback);
  }

  public disconnect(): void {
    this.loggerService.log('INFO', '클라이언트 연결 해제');
    this.service.disconnect();
  }
}
