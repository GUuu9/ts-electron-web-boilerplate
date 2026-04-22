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
        <div class="test-section">
          <h4>Real-time System Resource</h4>
          <div id="system-status-container" style="background: rgba(0,0,0,0.2); padding: 1.5rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 1.5rem;">
            <p style="color: var(--text-dim);">Loading system information...</p>
          </div>
          <div class="button-group">
            <button class="primary" onclick="window.maintenanceController.startMonitoring()">Start Real-time Update</button>
            <button class="primary" style="background: #ef4444;" onclick="window.maintenanceController.stopMonitoring()">Stop Update</button>
          </div>
        </div>
      </div>`;
  }

  private getOsIntegrationTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>Native Notification</h4>
          <div class="form-group">
            <label>Title</label>
            <input type="text" id="noti-title" value="Hello Electron!">
          </div>
          <div class="form-group">
            <label>Body Content</label>
            <textarea id="noti-body">This is a native notification sent from the renderer process via IPC.</textarea>
          </div>
          <div class="button-group">
            <button class="primary" onclick="window.maintenanceController.testNotification()">Send Notification</button>
          </div>
        </div>

        <div class="test-section" style="margin-top: 1.5rem;">
          <h4>Global Shortcut (Read Only)</h4>
          <p style="font-size: 0.85rem; color: var(--text-dim);">
            The following shortcut is registered to toggle the window visibility:
          </p>
          <div style="margin-top: 0.5rem; padding: 0.75rem; background: rgba(255,255,255,0.05); border-radius: 4px; font-family: monospace; display: inline-block;">
            ${window.electronAPI?.platform === 'darwin' ? '⌘ + Shift + X' : 'Alt + Shift + X'}
          </div>
        </div>
      </div>`;
  }

  private getToolsTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>${window.uiSettings?.t('maintenance.tools') || 'Tools & Settings'}</h4>
          <div class="form-group">
            <label>${window.uiSettings?.t('maintenance.theme_switch') || 'Toggle Theme'}</label>
            <div class="button-group">
              <button class="primary" onclick="window.maintenanceController.toggleTheme()">Switch Dark/Light Mode</button>
            </div>
          </div>
          
          <div class="form-group" style="margin-top: 1.5rem;">
            <label>${window.uiSettings?.t('maintenance.lang_switch') || 'Language Settings'}</label>
            <div class="button-group">
              <button class="primary" style="background: ${window.uiSettings?.getCurrentLanguage() === 'ko' ? 'var(--primary)' : 'var(--bg-tertiary)'};" onclick="window.maintenanceController.changeLanguage('ko')">한국어</button>
              <button class="primary" style="background: ${window.uiSettings?.getCurrentLanguage() === 'en' ? 'var(--primary)' : 'var(--bg-tertiary)'};" onclick="window.maintenanceController.changeLanguage('en')">English</button>
            </div>
          </div>

          <div style="margin-top: 2rem; border-top: 1px solid var(--border); padding-top: 1rem;">
            <div class="button-group">
              <button class="primary" style="background: #64748b;" onclick="window.maintenanceController.checkLogPath()">Check Log Directory</button>
              <button class="primary" style="background: #ef4444;" onclick="window.uiLogger.clear()">Clear UI Logs</button>
            </div>
          </div>
        </div>
      </div>`;
  }
}
