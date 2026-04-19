import './styles/main.css';
import './styles/components.css';
import { UILoggerService } from './core/ui-logger.service.js';
import { UIRouterService } from './core/ui-router.service.js';
import { TesterController } from './features/tester/tester.controller.js';

// Network Controllers
import { NetworkController } from './features/network/network.controller.js';
import { HttpController } from './features/network/http.controller.js';
import { SocketController } from './features/network/socket.controller.js';
import { TcpUdpController } from './features/network/tcp-udp.controller.js';

// Device Controllers
import { DeviceController } from './features/device/device.controller.js';
import { BluetoothController } from './features/device/bluetooth.controller.js';
import { UsbController } from './features/device/usb.controller.js';
import { MediaController } from './features/device/media.controller.js';

// Shared Controllers
import { ConverterController } from './features/shared/converter.controller.js';
import { ConverterService } from '../../shared/converter.service.js';

// Logger Controllers
import { LoggerController } from './features/logger/logger.controller.js';
import { AuditLoggerController } from './features/logger/audit-logger.controller.js';

// 렌더러 전역 타입 정의
declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      tcp: {
        connect: (host: string, port: number) => Promise<{ success: boolean; error?: string }>;
        send: (msg: string) => void;
        onData: (callback: (data: string) => void) => void;
        disconnect: () => void;
      };
      udp: {
        bind: (port: number) => Promise<{ success: boolean; error?: string }>;
        send: (msg: string, port: number, host: string) => Promise<{ success: boolean; error?: string }>;
        onData: (callback: (data: { message: string, address: string, port: number }) => void) => void;
        close: () => void;
      };
      tcpServer: {
        listen: (port: number) => Promise<{ success: boolean; error?: string }>;
        send: (clientId: string, message: string) => void;
        broadcast: (message: string) => void;
        close: () => void;
        getClients: () => Promise<string[]>;
        onData: (callback: (data: { clientId: string, data: string }) => void) => void;
        onStatus: (callback: (message: string) => void) => void;
      };
      socketServer: {
        listen: (port: number) => Promise<{ success: boolean; error?: string }>;
        emit: (clientId: string, event: string, data: any) => void;
        broadcast: (event: string, data: any) => void;
        close: () => void;
        getClients: () => Promise<string[]>;
        onData: (callback: (data: { clientId: string, event: string, data: string }) => void) => void;
        onStatus: (callback: (message: string) => void) => void;
      };
      devices: {
        onBluetoothList: (callback: (list: any[]) => void) => void;
        selectBluetooth: (id: string) => void;
        onUsbList: (callback: (list: any[]) => void) => void;
        selectUsb: (id: string) => void;
        onHidList: (callback: (list: any[]) => void) => void;
        selectHid: (id: string) => void;
        cancelSelect: () => void;
      };
      recordAuditLog: (action: string) => void;
    };
    uiRouter: UIRouterService;
    uiLogger: UILoggerService;
    testerController: TesterController;
    networkController: NetworkController;
    deviceController: DeviceController;
    sharedController: ConverterController;
    loggerController: LoggerController;
    showTest: (type: string) => void;
    showDashboard: () => void;
  }
}

function bootstrap() {
  // 1. 코어 서비스 초기화
  const uiLogger = new UILoggerService();
  const uiRouter = new UIRouterService();
  
  // 2. 하위 도메인 컨트롤러 초기화 (SRP 분리됨)
  const httpCtrl = new HttpController(uiLogger);
  const socketCtrl = new SocketController(uiLogger);
  const l4Ctrl = new TcpUdpController(uiLogger);
  
  const btCtrl = new BluetoothController(uiLogger);
  const usbCtrl = new UsbController(uiLogger);
  const mediaCtrl = new MediaController(uiLogger);

  const converterService = new ConverterService();
  const converterCtrl = new ConverterController(uiLogger, converterService);

  const auditLoggerCtrl = new AuditLoggerController(uiLogger);
  const loggerCtrl = new LoggerController(uiLogger, auditLoggerCtrl);

  // 3. 메인 허브 컨트롤러 초기화 (의존성 주입)
  const networkController = new NetworkController(uiLogger, httpCtrl, socketCtrl, l4Ctrl);
  const deviceController = new DeviceController(uiLogger, btCtrl, usbCtrl, mediaCtrl);
  const testerController = new TesterController(uiLogger, networkController, deviceController);

  // 4. 전역 윈도우 객체에 노출
  window.uiLogger = uiLogger;
  window.uiRouter = uiRouter;
  window.testerController = testerController;
  window.networkController = networkController;
  window.deviceController = deviceController;
  window.sharedController = converterCtrl;
  window.loggerController = loggerCtrl;

  window.showDashboard = () => uiRouter.showDashboard();
  window.showTest = (type: string) => {
    uiLogger.clear();
    uiRouter.showTestDetail(type);
  };

  // 5. 이벤트 바인딩
  document.getElementById('card-network')?.addEventListener('click', () => uiRouter.showTestDetail('network'));
  document.getElementById('card-device')?.addEventListener('click', () => uiRouter.showTestDetail('device'));
  document.getElementById('card-shared')?.addEventListener('click', () => uiRouter.showTestDetail('shared'));
  document.getElementById('card-database')?.addEventListener('click', () => uiRouter.showTestDetail('database'));
  document.getElementById('card-logger')?.addEventListener('click', () => uiRouter.showTestDetail('logger'));

  // 6. 플랫폼 상태 업데이트
  const platformStatus = document.getElementById('platform-status');
  const isElectron = !!window.electronAPI;

  if (platformStatus) {
    const platform = window.electronAPI ? window.electronAPI.platform : 'Web Browser';
    platformStatus.innerText = isElectron ? `Running on Desktop (${platform})` : 'Running on Web Browser';
  }

  // 7. 데스크탑 환경 제어
  if (isElectron) {
    // 텍스트 선택 방지 (단, 로그 패널 영역은 제외)
    document.addEventListener('selectstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('#log-panel')) return; // 로그 패널은 선택 허용
      e.preventDefault();
    });
    
    // 페이지 리셋 단축키 (Cmd+R / Ctrl+R) 방지
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
      }
    });
  }

  // 8. 초기 화면 설정
  uiRouter.showDashboard();
  document.body.classList.add('ready');
}

window.addEventListener('DOMContentLoaded', bootstrap);
