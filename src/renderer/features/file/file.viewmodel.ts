import { FileRepository } from '../../data/file/file.repository.js';

/**
 * File ViewModel
 */
export class FileViewModel {
  constructor(private readonly repository: FileRepository) {}

  public async pickAndRead() {
    const path = await this.repository.openDialog();
    if (!path) return null;
    const content = await this.repository.read(path);
    return { path, content };
  }

  public async saveFile(path: string, content: string) {
    await this.repository.write(path, content);
  }
}
