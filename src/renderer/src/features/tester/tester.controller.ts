import { container } from '../../../../core/di/container.renderer.js';
import { CalcController } from '../../../../features/calc/calc.controller.js';
import type { BluetoothService } from '../../../../core/device/bluetooth.service.js';
import type { UsbService } from '../../../../core/device/usb.service.js';
import type { MediaService } from '../../../../core/device/media.service.js';
import type { HttpClient } from '../../../../core/network/http.client.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';
import { COMMANDS } from './commands.js';

export class TesterController {
  constructor(private readonly logger: UILoggerService) {}

  public handleCommand(): void {
    const input = document.getElementById('log-command') as HTMLInputElement;
    const rawInput = input.value.trim();
    if (!rawInput) return;

    // 슬래시(/)가 있으면 명령어, 없으면 일반 로그로 처리하거나 무시
    const isCommand = rawInput.startsWith('/');
    const parts = isCommand ? rawInput.slice(1).split(' ') : [];
    const cmdName = parts[0]?.toLowerCase();
    const args = parts.slice(1);

    if (isCommand && COMMANDS[cmdName]) {
      COMMANDS[cmdName].action(this.logger, args);
    } else if (isCommand) {
      this.logger.log(`Unknown command: ${rawInput}`, true);
    } else {
      this.logger.log(`Input: ${rawInput}`);
    }
    
    input.value = '';
  }

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
