import { FileSceneService } from './fileTest.service.js';

/**
 * File ViewModel
 */
export class FileViewModel {
  constructor(private readonly fileSceneService: FileSceneService) {}

  public async pickAndRead() {
    try {
      const path = await this.fileSceneService.openDialog();
      if (!path) return null;

      const content = await this.fileSceneService.read(path);
      return { path, content };
    } catch (error) {
      console.error('FileViewModel 오류:', error);
      return null;
    }
  }

  public async saveFile(path: string, content: string) {
    try {
      await this.fileSceneService.write(path, content);
    } catch (error) {
      console.error('FileViewModel 오류:', error);
    }
  }
}
