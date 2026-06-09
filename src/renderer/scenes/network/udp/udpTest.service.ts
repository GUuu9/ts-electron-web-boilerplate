import { UdpService } from '../../../domains/network/udp/services/udp.service.js';
import { LoggerService } from '../../../domains/logger/services/logger.service.js';

export class UdpSceneService {
  constructor(
    private service: UdpService,
    private loggerService: LoggerService
  ) {}

  public async bind(port: number): Promise<void> {
    await this.loggerService.log('INFO', `UDP 바인드 시도: ${port}`);
    try { await this.service.bind(port); } catch(e) { await this.loggerService.log('ERROR', `UDP 바인드 실패: ${e}`); throw e; }
  }

  public async send(msg: string, port: number, address: string): Promise<void> {
    await this.loggerService.log('INFO', `UDP 전송 시도: ${address}:${port}, ${msg}`);
    try { await this.service.send(msg, port, address); } catch(e) { await this.loggerService.log('ERROR', `UDP 전송 실패: ${e}`); throw e; }
  }

  public async close(): Promise<void> {
    await this.loggerService.log('INFO', 'UDP 소켓 닫기');
    try { await this.service.close(); } catch(e) { await this.loggerService.log('ERROR', `UDP 닫기 실패: ${e}`); throw e; }
  }

  public onData(callback: (data: { msg: string, rinfo: any }) => void) { return this.service.onData(callback); }
}
