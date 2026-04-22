import type { UILoggerService } from '../../core/ui-logger.service.js';
import type { UISettingsService, Language } from '../../core/ui-settings.service.js';

/**
 * 유지보수 및 시스템 모니터링을 담당하는 컨트롤러
 */
export class MaintenanceController {
  private statusInterval: any = null;

  constructor(
    private readonly logger: UILoggerService,
    private readonly settings: UISettingsService
  ) {}

  /**
   * 테마를 토글합니다.
   */
  public toggleTheme(): void {
    this.settings.toggleTheme();
    this.logger.log(`[SETTINGS] Theme changed to ${this.settings.getCurrentTheme()}`);
  }

  /**
   * 언어를 변경합니다.
   */
  public changeLanguage(lang: Language): void {
    this.settings.setLanguage(lang);
    this.logger.log(`[SETTINGS] Language changed to ${lang}. Please restart or refresh for full effect.`);
    
    // 즉각적인 UI 반영을 위해 페이지 새로고침 제안 또는 라우터 리렌더링
    if (confirm(lang === 'ko' ? '언어 설정을 적용하려면 페이지를 새로고침하시겠습니까?' : 'Refresh page to apply language settings?')) {
      window.location.reload();
    }
  }

  /**
   * 실시간 시스템 상태 업데이트를 시작합니다.
   */
  public async startMonitoring(): Promise<void> {
    if (this.statusInterval) return;

    this.logger.log('[MAINTENANCE] Starting system monitoring...');
    
    const update = async () => {
      if (!window.electronAPI) return;
      const status = await window.electronAPI.maintenance.getSystemStatus();
      this.renderStatus(status);
    };

    await update();
    this.statusInterval = setInterval(update, 2000); // 2초마다 업데이트
  }

  /**
   * 모니터링을 중단합니다.
   */
  public stopMonitoring(): void {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
      this.statusInterval = null;
      this.logger.log('[MAINTENANCE] System monitoring stopped.');
    }
  }

  /**
   * 로그 파일 경로를 확인합니다.
   */
  public async checkLogPath(): Promise<void> {
    if (!window.electronAPI) {
      this.logger.log('Available only on Desktop environment.', true);
      return;
    }
    const path = await window.electronAPI.maintenance.getLogPath();
    this.logger.log(`[MAINTENANCE] Log directory: ${path}`);
  }

  /**
   * 네이티브 알림을 테스트합니다.
   */
  public testNotification(): void {
    if (!window.electronAPI) {
      this.logger.log('Native notification is available only on Desktop.', true);
      return;
    }

    const titleInput = document.getElementById('noti-title') as HTMLInputElement;
    const bodyInput = document.getElementById('noti-body') as HTMLTextAreaElement;

    const title = titleInput?.value || 'Test Notification';
    const body = bodyInput?.value || 'This is a test message.';

    window.electronAPI.os.notify(title, body);
    this.logger.log(`[OS] Notification sent: "${title}"`);
  }

  private renderStatus(status: any): void {
    const container = document.getElementById('system-status-container');
    if (!container) return;

    container.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; font-size: 0.85rem;">
        <div class="status-item"><strong>OS:</strong> ${status.platform} (${status.arch})</div>
        <div class="status-item"><strong>CPU:</strong> ${status.cpuCount} Core</div>
        <div class="status-item" style="grid-column: span 2;"><strong>Model:</strong> ${status.cpuModel}</div>
        <div class="status-item"><strong>Memory:</strong> ${status.usedMemory} / ${status.totalMemory}</div>
        <div class="status-item"><strong>Mem %:</strong> ${status.memoryPercentage}%</div>
        <div class="status-item"><strong>Uptime:</strong> ${status.uptime}</div>
        <div class="status-item"><strong>Node:</strong> ${status.nodeVersion}</div>
      </div>
    `;
  }
}
