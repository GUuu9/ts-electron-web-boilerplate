import { FileService } from '../../domains/file/services/file.service.js'
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class FileTestService {
  constructor(
    private fileService: FileService,
    private loggerService: LoggerService
  ) {}

  public async read(path: string): Promise<string> {
    await this.loggerService.log('INFO', `파일 읽기 시도: ${path}`);
    try {
      const content = await this.fileService.read(path);
      await this.loggerService.log('INFO', `파일 읽기 완료: ${path}`);
      return content;
    } catch (error) {
      await this.loggerService.log('ERROR', `파일 읽기 실패: ${path}, ${error}`);
      throw error;
    }
  }

  public async write(path: string, content: string): Promise<void> {
    await this.loggerService.log('INFO', `파일 저장 시도: ${path}`);
    try {
      await this.fileService.write(path, content);
      await this.loggerService.log('INFO', `파일 저장 완료: ${path}`);
    } catch (error) {
      await this.loggerService.log('ERROR', `파일 저장 실패: ${path}, ${error}`);
      throw error;
    }
  }

  public async openDialog(): Promise<string | null> {
    return await this.fileService.openDialog();
  }
}