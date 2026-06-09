import { MediaRepository } from '../../../data/ipc/media/media.repository.js';

export class MediaService {
  constructor(private repository: MediaRepository) {}

  public async enumerateDevices(): Promise<MediaDeviceInfo[]> {
    return await this.repository.enumerateDevices();
  }

  public async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
    return await this.repository.getUserMedia(constraints);
  }

  public getGamepads(): (Gamepad | null)[] {
    return this.repository.getGamepads();
  }

  public onDeviceChange(callback: () => void): void {
    this.repository.onDeviceChange(callback);
  }
}
