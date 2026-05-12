import { AuditLogger } from '../../features/logger/audit-logger.service.js';
import { SystemInfoService } from '../../features/system/system-info.service.js';
import { PersistenceService } from '../../features/persistence/persistence.service.js';
import { HttpClient } from '../../features/network/http.client.js';
import { SocketClient } from '../../features/network/socket.client.js';
import { SocketServer } from '../../features/network/socket.server.js';
import { TcpClient } from '../../features/network/tcp.client.js';
import { TcpServer } from '../../features/network/tcp.server.js';
import { UdpClient } from '../../features/network/udp.client.js';
import { BluetoothService } from '../../features/device/bluetooth.service.js';
import { UsbService } from '../../features/device/usb.service.js';
import { MediaService } from '../../features/device/media.service.js';
import { OSIntegrationService } from '../../features/os/os-integration.service.js';

/**
 * 간단한 의존성 주입(DI) 컨테이너 클래스
 * 메인 프로세스용 (Node.js 서비스 포함)
 */
export class MainDIContainer {
  private static instance: MainDIContainer;
  private readonly services = new Map<string, any>();

  private constructor() {
    this.services.set('AuditLogger', new AuditLogger());
    this.services.set('SystemInfoService', new SystemInfoService());
    this.services.set('PersistenceService', new PersistenceService());
    this.services.set('OSIntegrationService', new OSIntegrationService());

    this.services.set('HttpClient', new HttpClient());
    this.services.set('SocketClient', new SocketClient());
    this.services.set('SocketServer', new SocketServer());
    this.services.set('TcpClient', new TcpClient());
    this.services.set('TcpServer', new TcpServer());
    this.services.set('UdpClient', new UdpClient());
    this.services.set('BluetoothService', new BluetoothService());
    this.services.set('UsbService', new UsbService());
    this.services.set('MediaService', new MediaService());
  }

  /**
   * 싱글톤 인스턴스를 가져옵니다.
   */
  public static getInstance(): MainDIContainer {
    if (!MainDIContainer.instance) MainDIContainer.instance = new MainDIContainer();
    return MainDIContainer.instance;
  }

  /**
   * 등록된 서비스나 컨트롤러를 가져옵니다.
   */
  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`${key}가 컨테이너에 등록되지 않았습니다.`);
    return service as T;
  }
}

export const container = MainDIContainer.getInstance();

