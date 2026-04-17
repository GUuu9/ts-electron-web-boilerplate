import { container } from '../../../../core/di/container.renderer.js';
import type { BluetoothService } from '../../../../core/device/bluetooth.service.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

const SERVICE_NAMES: Record<string, string> = {
  '0000180d': 'Heart Rate',
  '0000180f': 'Battery Service',
  '00001812': 'HID (Input Device)'
};

export class BluetoothController {
  constructor(private readonly logger: UILoggerService) {}

  private get electronAPI() {
    return (window as any).electronAPI;
  }

  public async testBluetooth(renderCallback: (list: any[]) => void, onComplete: () => void): Promise<void> {
    try {
      if (this.electronAPI?.devices) {
        this.electronAPI.devices.onBluetoothList((list: any[]) => renderCallback(list));
      }
      
      const bt = container.get<BluetoothService>('BluetoothService');
      const device = await bt.requestDevice();
      
      if (!device) return;
      
      const server = await bt.connect();
      if (server?.connected) {
        this.logger.log(`[BT] Connected to ${device.name}`);
        const services = await bt.getServices();
        services.forEach(s => {
          this.logger.log(`• Service: ${SERVICE_NAMES[s.uuid.substring(0, 8)] || 'Custom'}`);
        });
      }
    } catch (err: any) {
      this.logger.log(`[BT] Error: ${err.message}`, true);
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
