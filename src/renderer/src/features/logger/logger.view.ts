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
        <div class="test-section">
          <h4>UI Logger Test</h4>
          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
            화면 하단 로그 패널의 동작을 테스트합니다.
          </p>
          <div class="button-group">
            <button class="primary" onclick="window.loggerController.testLog()">Send Info Log</button>
            <button class="primary" style="background: #ef4444;" onclick="window.loggerController.testErrorLog()">Send Error Log</button>
          </div>
        </div>
      </div>`;
  }

  private getAuditLoggerTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>Audit Log Test</h4>
          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
            시스템 감사 로그(Audit Log)를 기록하는 기능을 테스트합니다.
          </p>
          <div class="form-group">
            <label>Action Name</label>
            <input type="text" id="audit-action" value="USER_CLICK_TEST">
          </div>
          <div class="button-group">
            <button class="primary" onclick="window.loggerController.testRecode(document.getElementById('audit-action').value)">Record Audit Log</button>
          </div>
        </div>
      </div>`;
  }
}
