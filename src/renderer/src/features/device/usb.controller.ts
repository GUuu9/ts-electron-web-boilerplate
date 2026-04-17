import { container } from '../../../../core/di/container.renderer.js';
import type { UsbService } from '../../../../core/device/usb.service.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class UsbController {
  constructor(private readonly logger: UILoggerService) {}

  private get electronAPI() {
    return (window as any).electronAPI;
  }

  public async testUsb(renderCallback: (list: any[]) => void, onComplete: () => void) {
    try {
      if (this.electronAPI?.devices) {
        this.electronAPI.devices.onUsbList((list: any[]) => renderCallback(list));
      }
      await container.get<UsbService>('UsbService').requestUsbDevice();
    } catch (err: any) {
      this.logger.log(`[USB] Error: ${err.message}`, true);
      throw err;
    } finally {
      onComplete();
    }
  }

  public async testHid(renderCallback: (list: any[]) => void, onComplete: () => void) {
    try {
      if (this.electronAPI?.devices) {
        this.electronAPI.devices.onHidList((list: any[]) => renderCallback(list));
      }
      await container.get<UsbService>('UsbService').requestHidDevice();
    } catch (err: any) {
      this.logger.log(`[HID] Error: ${err.message}`, true);
      throw err;
    } finally {
      onComplete();
    }
  }

  public cancelScan() {
    if (this.electronAPI?.devices) {
      this.electronAPI.devices.cancelSelect();
    }
  }
}
