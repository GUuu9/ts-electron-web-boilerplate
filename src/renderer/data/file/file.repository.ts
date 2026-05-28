/**
 * File Repository
 */
export class FileRepository {
  public async read(path: string): Promise<string> {
    if (!(window as any).electronAPI?.file) return '';
    return await (window as any).electronAPI.file.read(path);
  }
  public async write(path: string, content: string): Promise<void> {
    if (!(window as any).electronAPI?.file) return;
    await (window as any).electronAPI.file.write(path, content);
  }
  public async openDialog(): Promise<string | null> {
    if (!(window as any).electronAPI?.file) return null;
    return await (window as any).electronAPI.file.openDialog();
  }
}
