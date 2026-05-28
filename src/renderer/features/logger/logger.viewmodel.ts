import { LoggerRepository } from '../../data/logger/logger.repository.js';

/**
 * Logger ViewModel
 */
export class LoggerViewModel {
  constructor(private readonly repository: LoggerRepository) {}

  public async selectLogFile() {
    return await this.repository.selectLogFile();
  }

  public async addLog(level: 'INFO' | 'ERROR' | 'DEBUG', message: string) {
    await this.repository.log(level, message);
  }
}
