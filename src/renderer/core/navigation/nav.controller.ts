import { Navigator } from './navigator.js';
import { HttpView } from '../../scenes/network/http/http.view.js';
import { SocketView } from '../../scenes/network/socket/socket.view.js';
import { TcpView } from '../../scenes/network/tcp/tcp.view.js';
import { UdpView } from '../../scenes/network/udp/udp.view.js';
import { OsView } from '../../scenes/os/os.view.js';
import { SystemView } from '../../scenes/system/system.view.js';
import { PersistenceView } from '../../scenes/persistence/persistence.view.js';
import { SecurityView } from '../../scenes/security/security.view.js';
import { SerialView } from '../../scenes/serial/serial.view.js';
import { MediaView } from '../../scenes/media/media.view.js';
import { FileView } from '../../scenes/file/file.view.js';
import { LoggerView } from '../../scenes/logger/logger.view.js';
import { MacroView } from '../../scenes/macro/macro.view.js';
import { AIView } from '../../scenes/ai/ai.view.js';
import { VisionView } from '../../scenes/vision/vision.view.js';
import { LLMView } from '../../scenes/llm/llm.view.js';

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
      macroView: MacroView;
      aiView: AIView;
      visionView: VisionView;
      llmView: LLMView;
    }
  ) {}

  public init() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      // 1. 뒤로가기 버튼 명시적 체크
      if (target.closest('#nav-back')) {
        this.navigator.showDashboard();
        return;
      }

      // 2. 카드 클릭 처리
      const card = target.closest('.card') as HTMLElement;
      if (!card) return;

      switch (card.id) {
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
        case 'nav-macro': this.navigator.navigate(this.views.macroView); break;
        case 'nav-ai': this.navigator.navigate(this.views.aiView); break;
        case 'nav-vision': this.navigator.navigate(this.views.visionView); break;
        case 'nav-llm': this.navigator.navigate(this.views.llmView); break;
      }
    });
  }
}
