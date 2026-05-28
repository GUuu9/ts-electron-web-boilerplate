import { MediaRepository } from '../../data/media/media.repository.js';
import { DeviceRepository } from '../../data/media/device.repository.js';

/**
 * Media ViewModel
 */
export class MediaViewModel {
  constructor(
    private readonly mediaRepo: MediaRepository,
    private readonly deviceRepo: DeviceRepository
  ) {}

  public async getMediaDevices() {
    const devices = await this.mediaRepo.enumerateDevices();
    return {
      audioIn: devices.filter(d => d.kind === 'audioinput'),
      audioOut: devices.filter(d => d.kind === 'audiooutput'),
      videoIn: devices.filter(d => d.kind === 'videoinput')
    };
  }

  public getGamepads() {
    return this.mediaRepo.getGamepads().filter(g => g !== null) as Gamepad[];
  }

  // --- Specialized Device Selection (IPC) ---
  public subscribeBtList(callback: (list: any[]) => void) { return this.deviceRepo.onBtList(callback); }
  public subscribeUsbList(callback: (list: any[]) => void) { return this.deviceRepo.onUsbList(callback); }
  public subscribeHidList(callback: (list: any[]) => void) { return this.deviceRepo.onHidList(callback); }

  public selectBt(id: string) { this.deviceRepo.selectBt(id); }
  public selectUsb(id: string) { this.deviceRepo.selectUsb(id); }
  public selectHid(id: string) { this.deviceRepo.selectHid(id); }
  public cancelSelect() { this.deviceRepo.cancelSelect(); }
}
