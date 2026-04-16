import { CalcService } from '../../shared/calc.service.js';
import { CalcController } from '../../features/calc/calc.controller.js';
import { HttpClient } from '../network/http.client.js';
import { SocketClient } from '../network/socket.client.js';
import { BluetoothService } from '../device/bluetooth.service.js';
import { UsbService } from '../device/usb.service.js';
import { MediaService } from '../device/media.service.js';
import { DeviceWatcherService } from '../device/device-watcher.service.js';

export class RendererDIContainer {
  private static instance: RendererDIContainer;
  private readonly services = new Map<string, any>();

  private constructor() {
    this.services.set('HttpClient', new HttpClient());
    this.services.set('SocketClient', new SocketClient());
    this.services.set('BluetoothService', new BluetoothService());
    this.services.set('UsbService', new UsbService());
    this.services.set('MediaService', new MediaService());
    this.services.set('DeviceWatcherService', new DeviceWatcherService());

    const calcService = new CalcService();
    this.services.set('CalcService', calcService);
    this.services.set('CalcController', new CalcController(calcService));
  }

  public static getInstance(): RendererDIContainer {
    if (!RendererDIContainer.instance) RendererDIContainer.instance = new RendererDIContainer();
    return RendererDIContainer.instance;
  }

  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`${key}가 컨테이너에 등록되지 않았습니다.`);
    return service as T;
  }
}

export const container = RendererDIContainer.getInstance();
