import { DeviceRepository } from '../../../data/ipc/media/device.repository.js';

export class DeviceService {
  constructor(private repository: DeviceRepository) {}

  public selectBt(id: string) { this.repository.selectBt(id); }
  public selectUsb(id: string) { this.repository.selectUsb(id); }
  public selectHid(id: string) { this.repository.selectHid(id); }
  public cancelSelect() { this.repository.cancelSelect(); }

  public onBtList(callback: (list: any[]) => void) { return this.repository.onBtList(callback); }
  public onUsbList(callback: (list: any[]) => void) { return this.repository.onUsbList(callback); }
  public onHidList(callback: (list: any[]) => void) { return this.repository.onHidList(callback); }
}
