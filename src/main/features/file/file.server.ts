import * as fs from 'fs/promises';
import { dialog } from 'electron';

/**
 * File Server (Backend Service)
 */
export class FileServer {
  public async readFile(filePath: string): Promise<string> {
    return await fs.readFile(filePath, 'utf-8');
  }

  public async writeFile(filePath: string, content: string): Promise<void> {
    await fs.writeFile(filePath, content, 'utf-8');
  }

  public async showOpenDialog(): Promise<string | null> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile']
    });
    return canceled ? null : filePaths[0];
  }
}
