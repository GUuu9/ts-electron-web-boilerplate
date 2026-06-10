import { FileRepository } from '../../../data/ipc/file/file.repository.js';

export class FileService {
  constructor(private repository: FileRepository) {}

  public async read(path: string): Promise<string> {
    return await this.repository.read(path);
  }

  public async write(path: string, content: string): Promise<void> {
    await this.repository.write(path, content);
  }

  public async openDialog(): Promise<string | null> {
    return await this.repository.openDialog();
  }

  public async saveDialog(): Promise<string | null> {
    return await this.repository.saveDialog();
  }
}
