/**
 * Logger Repository
 */
export class LoggerRepository {
  public async selectLogFile(): Promise<string | null> {
    return await (window as any).electronAPI.logger.selectLogFile();
  }
  public async log(level: 'INFO' | 'ERROR' | 'DEBUG', message: string): Promise<void> {
    await (window as any).electronAPI.logger.log(level, message);
  }
}
