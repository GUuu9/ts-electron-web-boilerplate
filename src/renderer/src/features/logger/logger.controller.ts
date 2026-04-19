import { AuditLoggerController } from "./audit-logger.controller";
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class LoggerController {
  constructor(
    private readonly logger: UILoggerService,
    private readonly audit: AuditLoggerController
  ) {}

  public async testRecode(action: string): Promise<void> {
    this.logger.log(`[Audit] Recording action: ${action}`);
    await this.audit.testRecode(action);
  }

  /**
   * 화면 로거를 테스트합니다.
   */
  public testLog(): void {
    const messages = [
      'Normal log message testing...',
      'System status is stable.',
      'User interaction detected.'
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    this.logger.log(msg);
  }

  /**
   * 에러 로깅을 테스트합니다.
   */
  public testErrorLog(): void {
    this.logger.log('This is a simulated error message!', true);
  }
}