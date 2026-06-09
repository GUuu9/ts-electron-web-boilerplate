import { VisionRepository } from '../../../data/ipc/vision/vision.repository.js';

export class VisionService {
  constructor(private repository: VisionRepository) {}

  public async processScreen(): Promise<string> {
    return await this.repository.processScreen();
  }
}
