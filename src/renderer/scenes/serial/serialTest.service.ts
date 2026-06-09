import { SerialService } from '../../domains/serial/services/serial.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class SerialSceneService {
  constructor(
    private service: SerialService,
    private loggerService: LoggerService
  ) {}

  public async getPorts() {
    await this.loggerService.log('INFO', '시리얼 포트 목록 조회');
    try { return await this.service.listPorts(); } catch(e) { await this.loggerService.log('ERROR', `포트 목록 조회 실패: ${e}`); throw e; }
  }

  public async connect(path: string, baudRate: number) {
    await this.loggerService.log('INFO', `시리얼 연결: ${path}`);
    try { return await this.service.open(path, baudRate); } catch(e) { await this.loggerService.log('ERROR', `연결 실패: ${e}`); throw e; }
  }

  public async disconnect(path: string) {
    await this.loggerService.log('INFO', `시리얼 연결 해제: ${path}`);
    try { return await this.service.close(path); } catch(e) { await this.loggerService.log('ERROR', `연결 해제 실패: ${e}`); throw e; }
  }

  public async send(path: string, data: string) {
    await this.loggerService.log('INFO', `시리얼 데이터 전송: ${path}`);
    try { return await this.service.write(path, data); } catch(e) { await this.loggerService.log('ERROR', `전송 실패: ${e}`); throw e; }
  }

  public subscribeData(callback: (data: { path: string, data: string }) => void) {
    return this.service.onData(callback);
  }
}
