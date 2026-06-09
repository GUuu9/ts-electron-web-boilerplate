import { container } from './container.renderer.js';

// Shared Services
import { HttpClient } from '../../../shared/http-client/http.client.js';
import { SocketClient } from '../../../shared/socket-client/socket.client.js';
import { TranslationService } from '../../../shared/i18n/i18n.service.js';

// Repositories
import { HttpRepository } from '../../data/network/http/http.repository.js';
import { SocketRepository } from '../../data/network/socket/socket.repository.js';
import { TcpRepository } from '../../data/network/tcp/tcp.repository.js';
import { UdpRepository } from '../../data/network/udp/udp.repository.js';
import { OsRepository } from '../../data/os/os.repository.js';
import { SystemRepository } from '../../data/system/system.repository.js';
import { PersistenceRepository } from '../../data/persistence/persistence.repository.js';
import { SecurityRepository } from '../../data/security/security.repository.js';
import { SerialRepository } from '../../data/serial/serial.repository.js';
import { MediaRepository } from '../../data/media/media.repository.js';
import { DeviceRepository } from '../../data/media/device.repository.js';
import { FileRepository } from '../../data/file/file.repository.js';
import { LoggerRepository } from '../../data/logger/logger.repository.js';

// ViewModels
import { HttpViewModel } from '../../domains/network/http/http.viewmodel.js';
import { SocketViewModel } from '../../domains/network/socket/socket.viewmodel.js';
import { TcpViewModel } from '../../domains/network/tcp/tcp.viewmodel.js';
import { UdpViewModel } from '../../domains/network/udp/udp.viewmodel.js';
import { OsViewModel } from '../../domains/os/os.viewmodel.js';
import { SystemViewModel } from '../../domains/system/system.viewmodel.js';
import { PersistenceViewModel } from '../../domains/persistence/persistence.viewmodel.js';
import { SecurityViewModel } from '../../domains/security/security.viewmodel.js';
import { SerialViewModel } from '../../domains/serial/serial.viewmodel.js';
import { MediaViewModel } from '../../domains/media/media.viewmodel.js';
import { FileViewModel } from '../../domains/file/file.viewmodel.js';
import { LoggerViewModel } from '../../domains/logger/logger.viewmodel.js';
import { AIViewModel } from '../../domains/ai/ai.viewmodel.js';

// Views & Binders
import { HttpView, HttpBinder } from '../../domains/network/http/http.view.js';
import { SocketView, SocketBinder } from '../../domains/network/socket/socket.view.js';
import { TcpView, TcpBinder } from '../../domains/network/tcp/tcp.view.js';
import { UdpView, UdpBinder } from '../../domains/network/udp/udp.view.js';
import { OsView, OsBinder } from '../../domains/os/os.view.js';
import { SystemView, SystemBinder } from '../../domains/system/system.view.js';
import { PersistenceView, PersistenceBinder } from '../../domains/persistence/persistence.view.js';
import { SecurityView, SecurityBinder } from '../../domains/security/security.view.js';
import { SerialView, SerialBinder } from '../../domains/serial/serial.view.js';
import { MediaView, MediaBinder } from '../../domains/media/media.view.js';
import { FileView, FileBinder } from '../../domains/file/file.view.js';
import { LoggerView, LoggerBinder } from '../../domains/logger/logger.view.js';
import { AIView, AIBinder } from '../../domains/ai/ai.view.js';

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
    // 1. Data Layer
    const httpClient = new HttpClient();
    const socketClient = new SocketClient();
    const translationService = new TranslationService();
    
    container.register('HttpClient', httpClient);
    container.register('SocketClient', socketClient);
    container.register('TranslationService', translationService);
    
    container.register('HttpRepository', new HttpRepository(httpClient));
    container.register('SocketRepository', new SocketRepository(container.get('SocketClient')));
    container.register('TcpRepository', new TcpRepository());
    container.register('UdpRepository', new UdpRepository());
    container.register('OsRepository', new OsRepository());
    container.register('SystemRepository', new SystemRepository());
    container.register('PersistenceRepository', new PersistenceRepository());
    container.register('SecurityRepository', new SecurityRepository());
    container.register('SerialRepository', new SerialRepository());
    container.register('MediaRepository', new MediaRepository());
    container.register('DeviceRepository', new DeviceRepository());
    container.register('FileRepository', new FileRepository());
    container.register('LoggerRepository', new LoggerRepository());
    
    // 2. ViewModel Layer
    container.register('HttpViewModel', new HttpViewModel(container.get('HttpRepository')));
    container.register('SocketViewModel', new SocketViewModel(container.get('SocketRepository')));
    container.register('TcpViewModel', new TcpViewModel(container.get('TcpRepository')));
    container.register('UdpViewModel', new UdpViewModel(container.get('UdpRepository')));
    container.register('OsViewModel', new OsViewModel(container.get('OsRepository')));
    container.register('SystemViewModel', new SystemViewModel(container.get('SystemRepository')));
    container.register('PersistenceViewModel', new PersistenceViewModel(container.get('PersistenceRepository')));
    container.register('SecurityViewModel', new SecurityViewModel(container.get('SecurityRepository')));
    container.register('SerialViewModel', new SerialViewModel(container.get('SerialRepository')));
    container.register('MediaViewModel', new MediaViewModel(container.get('MediaRepository'), container.get('DeviceRepository')));
    container.register('FileViewModel', new FileViewModel(container.get('FileRepository')));
    container.register('LoggerViewModel', new LoggerViewModel(container.get('LoggerRepository')));
    
    // AI Engine
    const aiCore = new AICore();
    const aiRunner = new AIRunner(aiCore, { mode: 'time', value: 30 });
    container.register('AICore', aiCore);
    container.register('AIRunner', aiRunner);

    container.register('AIViewModel', new AIViewModel(aiCore));
    
    // 3. View & Binder Layer
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
    
    const aiBinder = new AIBinder(aiView, container.get('AIViewModel'));
    aiBinder.bind();
    
    // 4. Navigation Layer
    const navigator = new Navigator();
    const navController = new NavController(navigator, { 
      httpView, socketView, tcpView, udpView, osView, systemView, 
      persistenceView, securityView, serialView, mediaView, fileView, loggerView, aiView
    }, {
      aiBinder
    }, {
      aiViewModel: container.get('AIViewModel')
    });
    
    container.register('Navigator', navigator);
    container.register('NavController', navController);
  }
}
