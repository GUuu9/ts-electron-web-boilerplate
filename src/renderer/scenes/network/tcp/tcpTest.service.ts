import { TcpService } from '../../../domains/network/tcp/services/tcp.service.js';
import { LoggerService } from '../../../domains/logger/services/logger.service.js';

export class TcpSceneService {
  constructor(
    private service: TcpService,
    private loggerService: LoggerService
  ) {}

  public get isDesktop(): boolean { return this.service.isDesktop; }

  public async startServer(port: number): Promise<void> {
    await this.loggerService.log('INFO', `TCP 서버 시작: ${port}`);
    try { await this.service.startServer(port); } catch(e) { await this.loggerService.log('ERROR', `TCP 서버 시작 실패: ${e}`); throw e; }
  }

  public async stopServer(): Promise<void> {
    await this.loggerService.log('INFO', 'TCP 서버 중지');
    try { await this.service.stopServer(); } catch(e) { await this.loggerService.log('ERROR', `TCP 서버 중지 실패: ${e}`); throw e; }
  }

  public async serverBroadcast(data: string): Promise<void> {
    await this.loggerService.log('INFO', `TCP 브로드캐스트: ${data}`);
    try { await this.service.serverBroadcast(data); } catch(e) { await this.loggerService.log('ERROR', `TCP 브로드캐스트 실패: ${e}`); throw e; }
  }

  public async connect(host: string, port: number): Promise<void> {
    await this.loggerService.log('INFO', `TCP 연결 시도: ${host}:${port}`);
    try { await this.service.connect(host, port); } catch(e) { await this.loggerService.log('ERROR', `TCP 연결 실패: ${e}`); throw e; }
  }

  public async disconnect(): Promise<void> {
    await this.loggerService.log('INFO', 'TCP 연결 해제');
    try { await this.service.disconnect(); } catch(e) { await this.loggerService.log('ERROR', `TCP 연결 해제 실패: ${e}`); throw e; }
  }

  public async clientSend(data: string): Promise<void> {
    await this.loggerService.log('INFO', `TCP 데이터 전송: ${data}`);
    try { await this.service.clientSend(data); } catch(e) { await this.loggerService.log('ERROR', `TCP 전송 실패: ${e}`); throw e; }
  }

  public onServerConnected(callback: (clientId: string) => void) { this.service.onServerConnected(callback); }
  public onServerDisconnected(callback: (clientId: string) => void) { this.service.onServerDisconnected(callback); }
  public onServerData(callback: (data: { clientId: string, data: string }) => void) { this.service.onServerData(callback); }
  public onClientConnected(callback: () => void) { this.service.onClientConnected(callback); }
  public onClientDisconnected(callback: () => void) { this.service.onClientDisconnected(callback); }
  public onClientData(callback: (data: string) => void) { this.service.onClientData(callback); }
}
