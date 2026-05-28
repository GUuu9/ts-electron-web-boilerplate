import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * Logger Service (Backend)
 */
export class LoggerService {
  private logFilePath: string = '';

  public setLogPath(filePath: string) {
    this.logFilePath = filePath;
  }

  public async log(level: 'INFO' | 'ERROR' | 'DEBUG', message: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}\n`;
    
    console.log(formattedMessage.trim());

    if (this.logFilePath) {
      try {
        await fs.appendFile(this.logFilePath, formattedMessage, 'utf8');
      } catch (err) {
        console.error('Failed to write log to file:', err);
      }
    }
  }
}
