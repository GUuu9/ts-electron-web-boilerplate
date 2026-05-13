/**
 * MaintenanceView
 * 역할: 시스템 유지보수(리소스, OS 통합, 도구) 관련 UI 템플릿을 생성합니다.
 */
export class MaintenanceView {
  public getHtml(subType: string): string {
    switch (subType) {
      case 'system':
        return this.getSystemResourceTemplate();
      case 'os':
        return this.getOsIntegrationTemplate();
      case 'utils':
        return this.getToolsTemplate();
      default:
        return '';
    }
  }

  private getSystemResourceTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="activity" style="color: #60a5fa; width: 20px;"></i>
            <h5 style="margin: 0; color: #60a5fa;">Real-time System Resource</h5>
          </div>

          <div id="system-status-container" style="background: rgba(0,0,0,0.3); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 1.5rem; min-height: 120px;">
            <p style="color: var(--text-dim); font-size: 0.9rem;">Loading system information...</p>
          </div>

          <div class="button-group" style="gap: 0.75rem;">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px;" onclick="window.maintenanceController.startMonitoring()">
              <i data-lucide="play" style="width: 16px; height: 16px;"></i>
              <span>Start Monitoring</span>
            </button>
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px; background: #ef4444;" onclick="window.maintenanceController.stopMonitoring()">
              <i data-lucide="square" style="width: 16px; height: 16px;"></i>
              <span>Stop Update</span>
            </button>
          </div>
        </div>
      </div>`;
  }

  private getOsIntegrationTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- Notification Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="bell" style="color: #f87171; width: 20px;"></i>
              <h5 style="margin: 0; color: #f87171;">Native OS Notification</h5>
            </div>

            <div class="form-group">
              <label>Notification Title</label>
              <input type="text" id="noti-title" value="Hello Electron!" style="padding: 10px;">
            </div>
            <div class="form-group">
              <label>Message Content</label>
              <textarea id="noti-body" style="height: 60px; padding: 10px;">This is a native notification sent via IPC bridge.</textarea>
            </div>
            <div class="button-group" style="margin-top: 1.5rem;">
              <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px; background: #ef4444;" onclick="window.maintenanceController.testNotification()">
                <i data-lucide="send" style="width: 16px; height: 16px;"></i>
                <span>Send Notification</span>
              </button>
            </div>
          </div>

          <!-- Shortcuts Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="keyboard" style="color: #fbbf24; width: 20px;"></i>
              <h5 style="margin: 0; color: #fbbf24;">Global Shortcuts</h5>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-dim); line-height: 1.5; margin-bottom: 1rem;">
              시스템 전역 단축키를 통해 앱의 가시성을 토글할 수 있습니다.
            </p>
            <div style="padding: 1rem; background: rgba(251, 191, 36, 0.05); border: 1px dashed rgba(251, 191, 36, 0.3); border-radius: 6px; font-family: monospace; display: inline-flex; align-items: center; gap: 8px; color: #fbbf24; font-weight: bold;">
              <i data-lucide="info" style="width: 14px;"></i>
              ${window.electronAPI?.platform === 'darwin' ? '⌘ + Shift + X' : 'Alt + Shift + X'}
            </div>
          </div>
        </div>
      </div>`;
  }

  private getToolsTemplate(): string {
    const t = (key: string) => window.uiSettings?.t(key);
    const isKo = window.uiSettings?.getCurrentLanguage() === 'ko';

    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="settings-2" style="color: #f59e0b; width: 20px;"></i>
            <h5 style="margin: 0; color: #f59e0b;">${t('maintenance.tools') || 'System Tools & Preferences'}</h5>
          </div>

          <!-- Theme Section -->
          <div class="form-group" style="margin-bottom: 2rem;">
            <label>${t('maintenance.theme_switch') || 'Application Theme'}</label>
            <div class="button-group">
              <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 220px; background: var(--bg-tertiary); border: 1px solid #f59e0b; color: #f59e0b;" onclick="window.maintenanceController.toggleTheme()">
                <i data-lucide="sun-moon" style="width: 16px; height: 16px;"></i>
                <span>Switch Dark / Light Mode</span>
              </button>
            </div>
          </div>
          
          <!-- Language Section -->
          <div class="form-group" style="margin-bottom: 2rem;">
            <label>${t('maintenance.lang_switch') || 'Display Language'}</label>
            <div class="button-group" style="gap: 0.75rem;">
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: ${isKo ? '#f59e0b' : 'transparent'}; border: 1px solid #f59e0b; color: ${isKo ? '#fff' : '#f59e0b'};" onclick="window.maintenanceController.changeLanguage('ko')">
                <i data-lucide="languages" style="width: 14px;"></i> 한국어 (Korean)
              </button>
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: ${!isKo ? '#f59e0b' : 'transparent'}; border: 1px solid #f59e0b; color: ${!isKo ? '#fff' : '#f59e0b'};" onclick="window.maintenanceController.changeLanguage('en')">
                <i data-lucide="languages" style="width: 14px;"></i> English
              </button>
            </div>
          </div>

          <!-- Log Management Section -->
          <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
            <div class="button-group" style="gap: 0.75rem;">
              <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; background: #64748b;" onclick="window.maintenanceController.checkLogPath()">
                <i data-lucide="folder" style="width: 16px; height: 16px;"></i>
                <span>Open Log Directory</span>
              </button>
              <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; background: #ef4444;" onclick="window.uiLogger.clear()">
                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                <span>Clear UI Logs</span>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }
}
