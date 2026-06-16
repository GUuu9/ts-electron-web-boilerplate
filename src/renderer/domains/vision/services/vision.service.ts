import { VisionRepository } from '../../../data/ipc/vision/vision.repository.js';

export class VisionService {
  constructor(private repository: VisionRepository) {}

  public async processScreen(): Promise<string> {
    return await this.repository.processScreen();
  }

  public async findImage(templatePath: string, similarity: number = 0.8): Promise<{ found: boolean, x?: number, y?: number, confidence: number }> {
    return await this.repository.findImage(templatePath, similarity);
  }

  public async captureRegion(): Promise<string | null> {
    return await this.repository.captureRegion();
  }

  public async processImageFile(filePath: string): Promise<string> {
    return await this.repository.processImageFile(filePath);
  }
}
