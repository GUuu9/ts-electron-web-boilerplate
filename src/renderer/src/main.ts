import './styles/main.css';
import './styles/components.css';
import { UILoggerService } from './core/ui-logger.service.js';
import { UIRouterService } from './core/ui-router.service.js';
import { TesterController } from './features/tester/tester.controller.js';
import { NetworkController } from './features/network/network.controller.js';
import { DeviceController } from './features/device/device.controller.js';

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
    };
    uiRouter: UIRouterService;
    uiLogger: UILoggerService;
    testerController: TesterController;
    networkController: NetworkController;
    deviceController: DeviceController;
    showTest: (type: string) => void;
    showDashboard: () => void;
  }
}

function bootstrap() {
  // 1. 코어 서비스 초기화
  const uiLogger = new UILoggerService();
  const uiRouter = new UIRouterService();
  
  // 2. 기능 컨트롤러 초기화 (의존성 주입)
  const testerController = new TesterController(uiLogger);
  const networkController = new NetworkController(uiLogger);
  const deviceController = new DeviceController(uiLogger);

  // 3. 전역 윈도우 객체에 노출
  window.uiLogger = uiLogger;
  window.uiRouter = uiRouter;
  window.testerController = testerController;
  window.networkController = networkController;
  window.deviceController = deviceController;

  window.showDashboard = () => uiRouter.showDashboard();
  window.showTest = (type: string) => {
    uiLogger.clear();
    uiRouter.showTestDetail(type);
  };

  // 4. 플랫폼 상태 업데이트
  const platformStatus = document.getElementById('platform-status');
  if (platformStatus) {
    const isElectron = !!window.electronAPI;
    const platform = window.electronAPI ? window.electronAPI.platform : 'Web Browser';
    platformStatus.innerText = isElectron ? `Running on Desktop (${platform})` : 'Running on Web Browser';
  }

  // 5. 초기 화면 설정
  uiRouter.showDashboard();
}

window.addEventListener('DOMContentLoaded', bootstrap);
