import { container } from '../../../../core/di/index.js';
import { CalcController } from '../../../../features/calc/calc.controller.js';
import type { BluetoothService, UsbService, MediaService } from '../../../../core/device/index.js';
import type { HttpClient } from '../../../../core/network/index.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class TesterController {
  constructor(private readonly logger: UILoggerService) {}

  public async runTest(serviceType: string): Promise<void> {
    this.logger.log(`Starting ${serviceType} test...`);

    try {
      switch (serviceType) {
        case 'calc': {
          const controller = container.get<CalcController>('CalcController');
          const platform = (window as any).electronAPI ? `Desktop (${(window as any).electronAPI.platform})` : 'Web Browser';
          this.logger.log(`Result: ${controller.handleRequest(platform)}`);
          break;
        }
        case 'http': {
          const http = container.get<HttpClient>('HttpClient');
          this.logger.log('Fetching data...');
          const res = await http.get('https://jsonplaceholder.typicode.com/todos/1');
          this.logger.log(`Data: ${JSON.stringify(res.data)}`);
          break;
        }
        case 'bluetooth': {
          const bt = container.get<BluetoothService>('BluetoothService');
          const device = await bt.requestDevice();
          this.logger.log(device ? `Found: ${device.name}` : 'No device selected.', !device);
          break;
        }
        case 'usb': {
          const usb = container.get<UsbService>('UsbService');
          const device = await usb.requestUsbDevice();
          this.logger.log(device ? `Selected: ${device.productName}` : 'No device.', !device);
          break;
        }
        case 'media': {
          const media = container.get<MediaService>('MediaService');
          const devices = await media.enumerateDevices();
          devices.forEach(d => this.logger.log(`${d.kind}: ${d.label || 'Permission required'}`));
          break;
        }
        default:
          this.logger.log(`${serviceType} test not implemented.`, true);
      }
    } catch (err: any) {
      this.logger.log(`Error: ${err.message}`, true);
    }
  }
}
