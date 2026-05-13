import type { SecurityView } from '../security/security.view.js';

/**
 * SharedView
 * 역할: 공용 서비스 로직(데이터 변환 등) 관련 UI 템플릿을 생성합니다.
 */
export class SharedView {
  constructor(private securityView: SecurityView) {}

  public getHtml(subType: string): string {
    switch (subType) {
      case 'calc':
        return this.getCalcTemplate();
      case 'security':
        return this.securityView.render();
      default:
        return '';
    }
  }

  private getCalcTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="calculator" style="color: var(--secondary); width: 20px;"></i>
            <h5 style="margin: 0; color: var(--secondary);">Shared Data Converter</h5>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.5rem; line-height: 1.5;">
            플랫폼 독립적인 공통 로직(shared/)을 테스트합니다. 숫자나 문자열을 입력하세요.
          </p>

          <div class="form-group">
            <label>Input Value</label>
            <input type="text" id="convert-input" placeholder="e.g. 255 or Hello" style="padding: 10px;">
          </div>

          <div class="button-group" style="margin-top: 1.5rem;">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px;" onclick="window.sharedController.convertToHex()">
              <i data-lucide="binary" style="width: 16px; height: 16px;"></i>
              <span>Convert to Hex</span>
            </button>
          </div>
        </div>
      </div>`;
  }
}
