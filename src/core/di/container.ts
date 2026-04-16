import { CalcService } from '../../shared/calc.service.js';
import { CalcController } from '../../features/calc/calc.controller.js';
import { HttpClient, SocketClient, TcpClient, UdpClient } from '../network/index.js';
import { BluetoothService, UsbService, MediaService } from '../device/index.js';

/**
 * 간단한 의존성 주입(DI) 컨테이너 클래스
 */
export class DIContainer {
  private static instance: DIContainer;
  private readonly services = new Map<string, any>();

  private constructor() {
    // 0. 환경 감지 (Electron Desktop 여부 확인)
    // 브라우저 환경에서도 process 객체가 존재할 수 있으므로(Vite define), versions.electron 여부를 가장 먼저 확인합니다.
    const isElectron = typeof process !== 'undefined' && 
                       process.versions && 
                       !!process.versions.electron;

    // 1. 공통 인프라 등록 (Web & Desktop 렌더러 모두 작동)
    this.services.set('HttpClient', new HttpClient());
    this.services.set('SocketClient', new SocketClient());

    // 1-2. 브라우저 전용 navigator API를 사용하는 서비스 (렌더러 환경에서만 등록)
    // 메인 프로세스에는 navigator가 없으므로 체크가 필수입니다.
    if (typeof navigator !== 'undefined') {
      this.services.set('BluetoothService', new BluetoothService());
      this.services.set('UsbService', new UsbService());
      this.services.set('MediaService', new MediaService());
    }

    // 데스크탑 전용 네트워크 클라이언트 (Node.js 기반)
    if (isElectron) {
      try {
        // Node.js 환경에서만 이 클래스들이 인스턴스화됩니다.
        this.services.set('TcpClient', new TcpClient());
        this.services.set('UdpClient', new UdpClient());
      } catch (err) {
        console.error('Desktop Client 등록 중 오류 발생:', err);
      }
    } else {
      // 브라우저 환경에서는 빈 객체나 경고 메시지를 등록하여 get() 호출 시 크래시를 방지합니다.
      this.services.set('TcpClient', { error: 'TCP는 웹 브라우저에서 지원되지 않습니다.' });
      this.services.set('UdpClient', { error: 'UDP는 웹 브라우저에서 지원되지 않습니다.' });
    }

    // 2. 서비스 등록
    const calcService = new CalcService();
    this.services.set('CalcService', calcService);

    // 2. 컨트롤러 등록 (서비스 주입)
    const calcController = new CalcController(calcService);
    this.services.set('CalcController', calcController);
  }

  /**
   * 싱글톤 인스턴스를 가져옵니다.
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * 등록된 서비스나 컨트롤러를 가져옵니다.
   */
  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`${key}가 컨테이너에 등록되지 않았습니다.`);
    }
    return service as T;
  }
}

// 편리한 접근을 위해 인스턴스 바로 노출
export const container = DIContainer.getInstance();
