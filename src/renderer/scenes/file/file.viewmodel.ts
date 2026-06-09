import { FileTestService } from './file.service.js';

/**
 * File ViewModel
 */
export class FileViewModel {
  constructor(private readonly fileTestService: FileTestService) {}

  public async pickAndRead() {
    try {
      // 여기서는 예시로 파일 읽기 로직만 호출
      const result = await this.fileTestService.read('example_path');
      return { path: 'example_path', content: result };
    } catch (error) {
      console.error('FileViewModel 오류:', error);
      return null;
    }
  }

  public async saveFile(path: string, content: string) {
    try {
      await this.fileTestService.write(path, content);
    } catch (error) {
      console.error('FileViewModel 오류:', error);
    }
  }
}
