import { FileService } from '../../domains/file/services/file.service.js'
import { LoggerService } from '../../domains/logger/services/logger.service.js';

/**
 * File Scene Service
 * 파일 관리 화면에서 사용하는 파일 관련 비즈니스 로직을 담당합니다.
 */
export class FileSceneService {
  constructor(
    private fileService: FileService,
    private loggerService: LoggerService
  ) {}

  /**
   * 파일을 읽습니다.
   * @param path 파일 경로
   * @param encoding 인코딩 (기본값 'utf-8')
   */
  public async read(path: string, encoding: string | null = 'utf-8'): Promise<any> {
    await this.loggerService.log('INFO', `파일 읽기 시도: ${path} (인코딩: ${encoding})`);
    try {
      const content = await this.fileService.read(path, encoding);
      await this.loggerService.log('INFO', `파일 읽기 완료: ${path}`);
      return content;
    } catch (error) {
      await this.loggerService.log('ERROR', `파일 읽기 실패: ${path}, ${error}`);
      throw error;
    }
  }

  /**
   * 파일을 저장합니다.
   * @param path 파일 경로
   * @param content 파일 내용
   * @param encoding 인코딩 (기본값 'utf-8')
   */
  public async write(path: string, content: string | Uint8Array, encoding: string | null = 'utf-8'): Promise<void> {
    await this.loggerService.log('INFO', `파일 저장 시도: ${path} (인코딩: ${encoding})`);
    try {
      await this.fileService.write(path, content, encoding);
      await this.loggerService.log('INFO', `파일 저장 완료: ${path}`);
    } catch (error) {
      await this.loggerService.log('ERROR', `파일 저장 실패: ${path}, ${error}`);
      throw error;
    }
  }

  /**
   * 파일 열기 다이얼로그를 표시합니다. (모든 파일 지원)
   */
  public async openDialog(): Promise<string | null> {
    return await this.fileService.openDialog([
      { name: 'All Files', extensions: ['*'] },
      { name: 'Images', extensions: ['jpg', 'png', 'gif', 'bmp'] },
      { name: 'Text Files', extensions: ['txt', 'json', 'md'] }
    ]);
  }
}