import { LoggerService } from '../../domains/logger/services/logger.service.js';

/**
 * Logger ViewModel
 */
export class LoggerViewModel {
  constructor(private readonly service: LoggerService) {}

  public async selectLogFile() {
    return await this.service.selectLogFile();
  }

  public async addLog(level: 'INFO' | 'ERROR' | 'DEBUG', message: string) {
    await this.service.log(level, message);
  }
}
