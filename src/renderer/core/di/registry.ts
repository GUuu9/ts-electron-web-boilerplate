import { container } from './container.renderer.js';

// Shared Services
import { HttpClient } from '../../../shared/http-client/http.client.js';
import { SocketClient } from '../../../shared/socket-client/socket.client.js';
import { TranslationService } from '../../../shared/i18n/i18n.service.js';

// Repositories (Data Layer)
import { HttpRepository } from '../../data/ipc/network/http/http.repository.js';
import { SocketRepository } from '../../data/ipc/network/socket/socket.repository.js';
import { TcpRepository } from '../../data/ipc/network/tcp/tcp.repository.js';
import { UdpRepository } from '../../data/ipc/network/udp/udp.repository.js';
import { OsRepository } from '../../data/ipc/os/os.repository.js';
import { SystemRepository } from '../../data/ipc/system/system.repository.js';
import { PersistenceRepository } from '../../data/ipc/persistence/persistence.repository.js';
import { SecurityRepository } from '../../data/ipc/security/security.repository.js';
import { SerialRepository } from '../../data/ipc/serial/serial.repository.js';
import { MediaRepository } from '../../data/ipc/media/media.repository.js';
import { DeviceRepository } from '../../data/ipc/media/device.repository.js';
import { FileRepository } from '../../data/ipc/file/file.repository.js';
import { LoggerRepository } from '../../data/ipc/logger/logger.repository.js';
import { AutomationRepository } from '../../data/ipc/automation/automation.repository.js';
import { VisionRepository } from '../../data/ipc/vision/vision.repository.js';

// Domain Services
import { HttpService } from '../../domains/network/http/services/http.service.js';
import { SocketService } from '../../domains/network/socket/services/socket.service.js';
import { TcpService } from '../../domains/network/tcp/services/tcp.service.js';
import { UdpService } from '../../domains/network/udp/services/udp.service.js';
import { OsService } from '../../domains/os/services/os.service.js';
import { SystemService } from '../../domains/system/services/system.service.js';
import { PersistenceService } from '../../domains/persistence/services/persistence.service.js';
import { SecurityService } from '../../domains/security/services/security.service.js';
import { SerialService } from '../../domains/serial/services/serial.service.js';
import { MediaService } from '../../domains/media/services/media.service.js';
import { DeviceService } from '../../domains/media/services/device.service.js';
import { FileService } from '../../domains/file/services/file.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';
import { AutomationService } from '../../domains/automation/services/automation.service.js';
import { VisionService } from '../../domains/vision/services/vision.service.js';

// Scene Services
import { HttpSceneService } from '../../scenes/network/http/httpTest.service.js';
import { SocketSceneService } from '../../scenes/network/socket/socketTest.service.js';
import { TcpSceneService } from '../../scenes/network/tcp/tcpTest.service.js';
import { UdpSceneService } from '../../scenes/network/udp/udpTest.service.js';
import { OsSceneService } from '../../scenes/os/osTest.service.js';
import { SystemSceneService } from '../../scenes/system/systemTest.service.js';
import { PersistenceSceneService } from '../../scenes/persistence/persistenceTest.service.js';
import { SecuritySceneService } from '../../scenes/security/securityTest.service.js';
import { SerialSceneService } from '../../scenes/serial/serialTest.service.js';
import { MediaSceneService } from '../../scenes/media/mediaTest.service.js';
import { FileSceneService } from '../../scenes/file/fileTest.service.js';
import { LoggerSceneService } from '../../scenes/logger/loggerTest.service.js';
import { AISceneService } from '../../scenes/ai/aiTest.service.js';
import { MacroSceneService } from '../../scenes/macro/macroTest.service.js';

// ViewModels
import { HttpViewModel } from '../../scenes/network/http/http.viewmodel.js';
import { SocketViewModel } from '../../scenes/network/socket/socket.viewmodel.js';
import { TcpViewModel } from '../../scenes/network/tcp/tcp.viewmodel.js';
import { UdpViewModel } from '../../scenes/network/udp/udp.viewmodel.js';
import { OsViewModel } from '../../scenes/os/os.viewmodel.js';
import { SystemViewModel } from '../../scenes/system/system.viewmodel.js';
import { PersistenceViewModel } from '../../scenes/persistence/persistence.viewmodel.js';
import { SecurityViewModel } from '../../scenes/security/security.viewmodel.js';
import { SerialViewModel } from '../../scenes/serial/serial.viewmodel.js';
import { MediaViewModel } from '../../scenes/media/media.viewmodel.js';
import { FileViewModel } from '../../scenes/file/file.viewmodel.js';
import { LoggerViewModel } from '../../scenes/logger/logger.viewmodel.js';
import { AIViewModel } from '../../scenes/ai/ai.viewmodel.js';
import { MacroViewModel } from '../../scenes/macro/macro.viewmodel.js';

// Views & Binders
import { HttpView, HttpBinder } from '../../scenes/network/http/http.view.js';
import { SocketView, SocketBinder } from '../../scenes/network/socket/socket.view.js';
import { TcpView, TcpBinder } from '../../scenes/network/tcp/tcp.view.js';
import { UdpView, UdpBinder } from '../../scenes/network/udp/udp.view.js';
import { OsView, OsBinder } from '../../scenes/os/os.view.js';
import { SystemView, SystemBinder } from '../../scenes/system/system.view.js';
import { PersistenceView, PersistenceBinder } from '../../scenes/persistence/persistence.view.js';
import { SecurityView, SecurityBinder } from '../../scenes/security/security.view.js';
import { SerialView, SerialBinder } from '../../scenes/serial/serial.view.js';
import { MediaView, MediaBinder } from '../../scenes/media/media.view.js';
import { FileView, FileBinder } from '../../scenes/file/file.view.js';
import { LoggerView, LoggerBinder } from '../../scenes/logger/logger.view.js';
import { AIView, AIBinder } from '../../scenes/ai/ai.view.js';
import { MacroView, MacroBinder } from '../../scenes/macro/macro.view.js';

// Core
import { AICore } from '../ai/ai.core.js';
import { AIRunner } from '../ai/ai.runner.js';
import { Navigator } from '../navigation/navigator.js';
import { NavController } from '../navigation/nav.controller.js';

/**
 * RendererRegistry (Composition Root)
 */
export class RendererRegistry {
  public static init() {
    this.registerInfrastructure();
    const domainServices = this.registerDataAndDomain();
    this.registerSceneServices(domainServices);
    this.registerViewModels();
    this.registerViewsAndBinders();
    this.registerNavigation();
  }

  private static registerInfrastructure() {
    container.register('HttpClient', new HttpClient());
    container.register('SocketClient', new SocketClient());
    container.register('TranslationService', new TranslationService());
    container.register('AICore', new AICore());
    container.register('AIRunner', new AIRunner(container.get('AICore'), { mode: 'time', value: 30 }));
  }

  private static registerDataAndDomain() {
    // Repositories
    const loggerRepo = new LoggerRepository();
    container.register('LoggerRepository', loggerRepo);
    
    // Domain Services
    const loggerService = new LoggerService(loggerRepo);
    container.register('LoggerService', loggerService);

    const persistenceService = new PersistenceService(new PersistenceRepository());
    container.register('PersistenceService', persistenceService);

    const httpService = new HttpService(new HttpRepository(container.get('HttpClient')));
    const socketService = new SocketService(new SocketRepository(container.get('SocketClient')));
    const tcpService = new TcpService(new TcpRepository());
    const udpService = new UdpService(new UdpRepository());
    const osService = new OsService(new OsRepository());
    const systemService = new SystemService(new SystemRepository());
    const securityService = new SecurityService(new SecurityRepository());
    const serialService = new SerialService(new SerialRepository());
    const mediaService = new MediaService(new MediaRepository());
    const deviceService = new DeviceService(new DeviceRepository());
    const fileService = new FileService(new FileRepository());

    return { 
      loggerService, httpService, socketService, tcpService, udpService, 
      osService, systemService, persistenceService, securityService, 
      serialService, mediaService, deviceService, fileService 
    };
  }

  private static registerSceneServices(ds: any) {
    container.register('HttpSceneService', new HttpSceneService(ds.httpService, ds.loggerService));
    container.register('SocketSceneService', new SocketSceneService(ds.socketService, ds.loggerService));
    container.register('TcpSceneService', new TcpSceneService(ds.tcpService, ds.loggerService));
    container.register('UdpSceneService', new UdpSceneService(ds.udpService, ds.loggerService));
    container.register('OsSceneService', new OsSceneService(ds.osService, ds.loggerService));
    container.register('SystemSceneService', new SystemSceneService(ds.systemService, ds.loggerService));
    container.register('PersistenceSceneService', new PersistenceSceneService(ds.persistenceService, ds.loggerService));
    container.register('SecuritySceneService', new SecuritySceneService(ds.securityService, ds.loggerService));
    container.register('SerialSceneService', new SerialSceneService(ds.serialService, ds.loggerService));
    container.register('MediaSceneService', new MediaSceneService(ds.mediaService, ds.deviceService, ds.loggerService));
    container.register('FileSceneService', new FileSceneService(ds.fileService, ds.loggerService));
    container.register('LoggerSceneService', new LoggerSceneService(ds.loggerService));
    container.register('AISceneService', new AISceneService(container.get('AICore'), ds.loggerService));
    
    // Macro Scene Service 등록 (Automation, Vision, File, Logger 의존)
    container.register('MacroSceneService', new MacroSceneService(
        new AutomationService(new AutomationRepository()),
        new VisionService(new VisionRepository()),
        ds.fileService,
        ds.loggerService
    ));
  }

  private static registerViewModels() {
    container.register('HttpViewModel', new HttpViewModel(container.get('HttpSceneService')));
    container.register('SocketViewModel', new SocketViewModel(container.get('SocketSceneService')));
    container.register('TcpViewModel', new TcpViewModel(container.get('TcpSceneService')));
    container.register('UdpViewModel', new UdpViewModel(container.get('UdpSceneService')));
    container.register('OsViewModel', new OsViewModel(container.get('OsSceneService')));
    container.register('SystemViewModel', new SystemViewModel(container.get('SystemSceneService')));
    container.register('PersistenceViewModel', new PersistenceViewModel(container.get('PersistenceSceneService')));
    container.register('SecurityViewModel', new SecurityViewModel(container.get('SecuritySceneService')));
    container.register('SerialViewModel', new SerialViewModel(container.get('SerialSceneService')));
    container.register('MediaViewModel', new MediaViewModel(container.get('MediaSceneService')));
    container.register('FileViewModel', new FileViewModel(container.get('FileSceneService')));
    container.register('LoggerViewModel', new LoggerViewModel(container.get('LoggerSceneService')));
    container.register('AIViewModel', new AIViewModel(container.get('AICore'), container.get('AISceneService')));
    container.register('MacroViewModel', new MacroViewModel(container.get('MacroSceneService')));
  }

  private static registerViewsAndBinders() {
    // ... binder logic same as before, using container.get('ViewModelName')
    const httpView = new HttpView();
    const socketView = new SocketView();
    const tcpView = new TcpView();
    const udpView = new UdpView();
    const osView = new OsView();
    const systemView = new SystemView();
    const persistenceView = new PersistenceView();
    const securityView = new SecurityView();
    const serialView = new SerialView();
    const mediaView = new MediaView();
    const fileView = new FileView();
    const loggerView = new LoggerView();
    const aiView = new AIView();
    const macroView = new MacroView();

    new HttpBinder(httpView, container.get('HttpViewModel')).bind();
    new SocketBinder(socketView, container.get('SocketViewModel')).bind();
    new TcpBinder(tcpView, container.get('TcpViewModel')).bind();
    new UdpBinder(udpView, container.get('UdpViewModel')).bind();
    new OsBinder(osView, container.get('OsViewModel')).bind();
    new SystemBinder(systemView, container.get('SystemViewModel')).bind();
    new PersistenceBinder(persistenceView, container.get('PersistenceViewModel')).bind();
    new SecurityBinder(securityView, container.get('SecurityViewModel')).bind();
    new SerialBinder(serialView, container.get('SerialViewModel')).bind();
    new MediaBinder(mediaView, container.get('MediaViewModel')).bind();
    new FileBinder(fileView, container.get('FileViewModel')).bind();
    new LoggerBinder(loggerView, container.get('LoggerViewModel')).bind();
    
    new AIBinder(aiView, container.get('AIViewModel')).bind();
    new MacroBinder(macroView, container.get('MacroViewModel')).bind();
    
    container.register('Views', { httpView, socketView, tcpView, udpView, osView, systemView, persistenceView, securityView, serialView, mediaView, fileView, loggerView, aiView, macroView });
  }

  private static registerNavigation() {
    const navigator = new Navigator();
    const navController = new NavController(navigator, container.get('Views'));
    
    container.register('Navigator', navigator);
    container.register('NavController', navController);
  }
}
