import { SystemService } from '../../domains/system/services/system.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class SystemSceneService {
  constructor(
    private service: SystemService,
    private loggerService: LoggerService
  ) {}

  public async getStatus(): Promise<any> {
    await this.loggerService.log('INFO', '시스템 상태 조회');
    try { return await this.service.getStatus(); } catch(e) { await this.loggerService.log('ERROR', `시스템 상태 조회 실패: ${e}`); throw e; }
  }
}
