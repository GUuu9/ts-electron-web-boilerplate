import { LoggerRepository } from '../../../data/ipc/logger/logger.repository.js';

export class LoggerService {
  constructor(private repository: LoggerRepository) {}

  public async selectLogFile(): Promise<string | null> {
    return await this.repository.selectLogFile();
  }

  public async log(level: 'INFO' | 'ERROR' | 'DEBUG', message: string): Promise<void> {
    await this.repository.log(level, message);
  }
}
