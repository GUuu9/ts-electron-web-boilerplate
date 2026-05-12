import { ipcMain, type BrowserWindow } from 'electron';
import { container } from '../../core/di/container.main.js';
import type { CoreFeature } from '../../core/core-feature.js';
import type { OSIntegrationService } from './os-integration.service.js';

/**
 * OS Integration Core Feature
 */
export class OSCoreFeature implements CoreFeature {
  id = 'os';

  onWindowCreated(mainWindow: BrowserWindow) {
    const osIntegration = container.get<OSIntegrationService>('OSIntegrationService');
    osIntegration.init(mainWindow);
  }

  setupHandlers() {
    const osIntegration = container.get<OSIntegrationService>('OSIntegrationService');
    ipcMain.on('os-notify', (_, title: string, body: string) => {
      osIntegration.notify(title, body);
    });
  }
}
