import { ipcMain } from 'electron';
import { container } from '../../core/di/container.main.js';
import type { CoreFeature } from '../../core/core-feature.js';
import type { SystemInfoService } from './system-info.service.js';


/**
 * System Core Feature
 */
export class SystemCoreFeature implements CoreFeature {
  id = 'system';

  setupHandlers() {
    const systemInfo = container.get<SystemInfoService>('SystemInfoService');
    ipcMain.handle('get-system-status', () => systemInfo.getStatus());
  }
}
