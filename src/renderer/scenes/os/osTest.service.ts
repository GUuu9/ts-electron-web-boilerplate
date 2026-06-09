import { OsService } from '../../domains/os/services/os.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class OsSceneService {
  constructor(
    private service: OsService,
    private loggerService: LoggerService
  ) {}

  public async notify(title: string, body: string): Promise<void> {
    await this.loggerService.log('INFO', `OS 알림 전송: ${title}`);
    try { await this.service.notify(title, body); } catch(e) { await this.loggerService.log('ERROR', `OS 알림 실패: ${e}`); throw e; }
  }
}
