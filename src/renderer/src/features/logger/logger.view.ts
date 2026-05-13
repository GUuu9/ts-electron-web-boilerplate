/**
 * LoggerView
 * 역할: 로깅(UI Logger, Audit Log) 관련 UI 템플릿을 생성합니다.
 */
export class LoggerView {
  public getHtml(subType: string): string {
    switch (subType) {
      case 'ui':
        return this.getUiLoggerTemplate();
      case 'audit':
        return this.getAuditLoggerTemplate();
      default:
        return '';
    }
  }

  private getUiLoggerTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="terminal" style="color: #10b981; width: 20px;"></i>
            <h5 style="margin: 0; color: #10b981;">UI Logger Interface Test</h5>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.5rem; line-height: 1.5;">
            화면 하단에 위치한 플로팅 로그 패널의 출력 기능을 테스트합니다.<br>
            정보 로그와 에러 로그의 색상 구분을 확인할 수 있습니다.
          </p>

          <div class="button-group" style="gap: 0.75rem;">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 160px; background: #10b981;" onclick="window.loggerController.testLog()">
              <i data-lucide="info" style="width: 16px; height: 16px;"></i>
              <span>Send Info Log</span>
            </button>
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 160px; background: #ef4444;" onclick="window.loggerController.testErrorLog()">
              <i data-lucide="alert-circle" style="width: 16px; height: 16px;"></i>
              <span>Send Error Log</span>
            </button>
          </div>
        </div>
      </div>`;
  }

  private getAuditLoggerTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="clipboard-list" style="color: #60a5fa; width: 20px;"></i>
            <h5 style="margin: 0; color: #60a5fa;">System Audit Logging</h5>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.5rem; line-height: 1.5;">
            시스템 보안 및 상태 추적을 위한 감사 로그(Audit Log)를 기록합니다.<br>
            기록된 로그는 메인 프로세스의 보안 저장소에 영구 보관됩니다.
          </p>

          <div class="form-group">
            <label>Action Identifier</label>
            <input type="text" id="audit-action" value="USER_CLICK_TEST" style="padding: 10px; font-family: monospace;">
          </div>

          <div class="button-group" style="margin-top: 1.5rem;">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px;" onclick="window.loggerController.testRecode(document.getElementById('audit-action').value)">
              <i data-lucide="save" style="width: 16px; height: 16px;"></i>
              <span>Record Audit Log</span>
            </button>
          </div>
        </div>
      </div>`;
  }
}
