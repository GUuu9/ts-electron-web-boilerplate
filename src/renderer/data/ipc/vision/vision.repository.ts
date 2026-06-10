/**
 * Vision Repository
 */
export class VisionRepository {
  public async processScreen(): Promise<string> {
    if (!(window as any).electronAPI?.vision) return '';
    return await (window as any).electronAPI.vision.processScreen();
  }

  public async findImage(templatePath: string, similarity: number): Promise<{ found: boolean, x?: number, y?: number, confidence: number }> {
    if (!(window as any).electronAPI?.vision) return { found: false, confidence: 0 };
    return await (window as any).electronAPI.vision.findImage(templatePath, similarity);
  }
}
