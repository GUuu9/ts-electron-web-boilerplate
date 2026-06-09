import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class LoggerSceneService {
  constructor(
    private service: LoggerService
  ) {}

  public async selectLogFile(): Promise<string | null> {
    try { return await this.service.selectLogFile(); } catch(e) { console.error(`로그 파일 선택 실패: ${e}`); throw e; }
  }

  public async addLog(level: 'INFO' | 'ERROR' | 'DEBUG', message: string): Promise<void> {
    try { await this.service.log(level, message); } catch(e) { console.error(`로그 기록 실패: ${e}`); throw e; }
  }
}
