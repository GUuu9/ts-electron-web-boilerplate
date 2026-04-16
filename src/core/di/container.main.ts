import { CalcService } from '../../shared/calc.service.js';
import { CalcController } from '../../features/calc/calc.controller.js';
import { HttpClient } from '../network/http.client.js';
import { SocketClient } from '../network/socket.client.js';
import { TcpClient } from '../network/tcp.client.js';
import { UdpClient } from '../network/udp.client.js';
import { BluetoothService } from '../device/bluetooth.service.js';
import { UsbService } from '../device/usb.service.js';
import { MediaService } from '../device/media.service.js';

export class MainDIContainer {
  private static instance: MainDIContainer;
  private readonly services = new Map<string, any>();

  private constructor() {
    this.services.set('HttpClient', new HttpClient());
    this.services.set('SocketClient', new SocketClient());
    this.services.set('TcpClient', new TcpClient());
    this.services.set('UdpClient', new UdpClient());
    this.services.set('BluetoothService', new BluetoothService());
    this.services.set('UsbService', new UsbService());
    this.services.set('MediaService', new MediaService());

    const calcService = new CalcService();
    this.services.set('CalcService', calcService);
    this.services.set('CalcController', new CalcController(calcService));
  }

  public static getInstance(): MainDIContainer {
    if (!MainDIContainer.instance) MainDIContainer.instance = new MainDIContainer();
    return MainDIContainer.instance;
  }

  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`${key}가 컨테이너에 등록되지 않았습니다.`);
    return service as T;
  }
}

export const container = MainDIContainer.getInstance();
