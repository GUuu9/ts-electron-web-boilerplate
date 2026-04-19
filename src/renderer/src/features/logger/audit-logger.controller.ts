import type { UILoggerService } from '../../core/ui-logger.service.js';

export class AuditLoggerController {
  constructor(private readonly logger: UILoggerService) {}

  public async testRecode(action: string): Promise<void> {
    this.logger.log(`[AUDIT-LOGGER] Requesting record: ${action}`);
    
    // Electron 환경인지 확인
    if (window.electronAPI) {
      try {
        window.electronAPI.recordAuditLog(action);
        this.logger.log(`Audit log request sent to Main process.`);
      } catch (err: any) {
        this.logger.log(`IPC Error: ${err.message}`, true);
      }
    } else {
      this.logger.log(`Audit logging is only available on Desktop (Electron).`, true);
    }
  } 
}