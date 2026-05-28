import { Navigator } from './navigator.js';
import { HttpView } from '../../features/network/http/http.view.js';
import { SocketView } from '../../features/network/socket/socket.view.js';
import { TcpView } from '../../features/network/tcp/tcp.view.js';
import { UdpView } from '../../features/network/udp/udp.view.js';
import { OsView } from '../../features/os/os.view.js';
import { SystemView } from '../../features/system/system.view.js';
import { PersistenceView } from '../../features/persistence/persistence.view.js';
import { SecurityView } from '../../features/security/security.view.js';
import { SerialView } from '../../features/serial/serial.view.js';
import { MediaView } from '../../features/media/media.view.js';
import { FileView } from '../../features/file/file.view.js';
import { LoggerView } from '../../features/logger/logger.view.js';
import { AIView, AIBinder } from '../../features/ai/ai.view.js';
import { AIViewModel } from '../../features/ai/ai.viewmodel.js';

/**
 * NavController
 * UI 네비게이션 이벤트 처리를 담당합니다.
 */
export class NavController {
  constructor(
    private readonly navigator: Navigator,
    private readonly views: { 
      httpView: HttpView; 
      socketView: SocketView; 
      tcpView: TcpView; 
      udpView: UdpView;
      osView: OsView;
      systemView: SystemView;
      persistenceView: PersistenceView;
      securityView: SecurityView;
      serialView: SerialView;
      mediaView: MediaView;
      fileView: FileView;
      loggerView: LoggerView;
      aiView: AIView;
    },
    private readonly binders: {
      aiBinder: AIBinder;
    },
    private readonly viewModels: {
      aiViewModel: AIViewModel;
    }
  ) {}

  public init() {
    document.addEventListener('click', (event) => {
      const target = (event.target as HTMLElement).closest('.card') as HTMLElement || event.target as HTMLElement;
      if (!target) return;

      switch (target.id) {
        case 'nav-http': this.navigator.navigate(this.views.httpView); break;
        case 'nav-socket': this.navigator.navigate(this.views.socketView); break;
        case 'nav-tcp': this.navigator.navigate(this.views.tcpView); break;
        case 'nav-udp': this.navigator.navigate(this.views.udpView); break;
        case 'nav-os': this.navigator.navigate(this.views.osView); break;
        case 'nav-system': this.navigator.navigate(this.views.systemView); break;
        case 'nav-persistence': this.navigator.navigate(this.views.persistenceView); break;
        case 'nav-security': this.navigator.navigate(this.views.securityView); break;
        case 'nav-serial': this.navigator.navigate(this.views.serialView); break;
        case 'nav-media': this.navigator.navigate(this.views.mediaView); break;
        case 'nav-file': this.navigator.navigate(this.views.fileView); break;
        case 'nav-logger': this.navigator.navigate(this.views.loggerView); break;
        case 'nav-ai': 
          this.navigator.navigate(this.views.aiView); 
          this.binders.aiBinder.init();
          break;
        case 'nav-back': 
          this.viewModels.aiViewModel.setActive(false);
          this.navigator.showDashboard(); 
          break;
      }
    });
  }
}
