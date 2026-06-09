/**
 * Vision Repository
 */
export class VisionRepository {
  public async captureScreen(): Promise<string> {
    if (!(window as any).electronAPI?.vision) return '';
    return await (window as any).electronAPI.vision.captureScreen();
  }
}
