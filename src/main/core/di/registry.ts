import { SocketCore } from '../../features/network/socket/socket.core.js';
import { TcpCoreModule } from '../../features/network/tcp/tcp.core.js';
import { UdpCoreModule } from '../../features/network/udp/udp.core.js';
import { OSCoreModule } from '../../features/os/os.core.js';
import { SystemCoreModule } from '../../features/system/system.core.js';
import { PersistenceCoreModule } from '../../features/persistence/persistence.core.js';
import { SecurityCoreModule } from '../../features/security/security.core.js';
import { SerialCoreModule } from '../../features/serial/serial.core.js';
import { MediaCoreModule } from '../../features/media/media.core.js';
import { FileCoreModule } from '../../features/file/file.core.js';
import { LoggerCoreModule } from '../../features/logger/logger.core.js';
import { AutomationCore } from '../../features/automation/automation.core.js';
import { VisionCore } from '../../features/vision/vision.core.js';
import { container } from './container.main.js';
import { BackendModule } from '../backend-module.js';

/**
 * MainRegistry (Composition Root for Backend)
 * 모든 백엔드 피처의 생성 및 조립을 담당합니다.
 */
export class MainRegistry {
  public static initBackend(mainWindow: any): void {
    const modules: BackendModule[] = [
      new SocketCore(),
      new TcpCoreModule(),
      new UdpCoreModule(),
      new OSCoreModule(),
      new SystemCoreModule(),
      new PersistenceCoreModule(),
      new SecurityCoreModule(),
      new SerialCoreModule(),
      new MediaCoreModule(),
      new FileCoreModule(),
      new LoggerCoreModule(),
      new AutomationCore(),
      new VisionCore(),
    ];

    // 컨테이너에 등록 및 초기화
    modules.forEach(module => {
      container.register(module.constructor.name, module);
      if (module.init) module.init();
      module.setupHandlers(mainWindow);
    });
  }
}
