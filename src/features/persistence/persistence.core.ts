import { ipcMain } from 'electron';
import { container } from '../../core/di/container.main.js';
import type { CoreFeature } from '../../core/core-feature.js';

/**
 * Persistence Core Feature
 */
export class PersistenceCoreFeature implements CoreFeature {
  id = 'persistence';

  setupHandlers() {
    const persistence = container.get<any>('PersistenceService');
    ipcMain.on('persistence-set', (_, key: string, value: any) => persistence.set(key, value));
    ipcMain.handle('persistence-get', (_, key: string) => persistence.get(key));
  }
}
