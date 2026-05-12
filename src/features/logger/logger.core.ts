import { ipcMain, app } from 'electron';
import { container } from '../../core/di/container.main.js';
import type { CoreFeature } from '../../core/core-feature.js';
import type { AuditLogger } from './audit-logger.service.js';

/**
 * Logger Core Feature
 */
export class LoggerCoreFeature implements CoreFeature {
  id = 'logger';

  setupHandlers() {
    const auditLogger = container.get<AuditLogger>('AuditLogger');

    ipcMain.on('record-audit-log', (_, action: string) => auditLogger.record(action));
    ipcMain.handle('get-log-path', () => app.getPath('userData'));
  }
}
