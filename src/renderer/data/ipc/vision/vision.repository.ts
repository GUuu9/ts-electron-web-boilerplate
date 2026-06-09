/**
 * Vision Repository
 */
export class VisionRepository {
  public async processScreen(): Promise<string> {
    if (!(window as any).electronAPI?.vision) return '';
    return await (window as any).electronAPI.vision.processScreen();
  }
}
