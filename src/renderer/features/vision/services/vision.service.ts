import { VisionRepository } from '../../../../data/ipc/vision/vision.repository.js';

export class VisionService {
  constructor(private repository: VisionRepository) {}

  public async captureScreen(): Promise<string> {
    return await this.repository.captureScreen();
  }
}
