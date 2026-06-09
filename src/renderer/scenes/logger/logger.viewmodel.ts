import { LoggerSceneService } from './loggerTest.service.js';

/**
 * Logger ViewModel
 */
export class LoggerViewModel {
  constructor(private readonly service: LoggerSceneService) {}

  public async selectLogFile() {
    try { return await this.service.selectLogFile(); } catch (e) { console.error('LoggerViewModel selectLogFile 오류:', e); return null; }
  }

  public async addLog(level: 'INFO' | 'ERROR' | 'DEBUG', message: string) {
    try { await this.service.addLog(level, message); } catch (e) { console.error('LoggerViewModel addLog 오류:', e); }
  }
}
