/**
 * SharedView
 * 역할: 공용 서비스 로직(데이터 변환 등) 관련 UI 템플릿을 생성합니다.
 */
export class SharedView {
  public getHtml(subType: string): string {
    switch (subType) {
      case 'calc':
        return this.getCalcTemplate();
      default:
        return '';
    }
  }

  private getCalcTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>Shared Data Converter</h4>
          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
            플랫폼 독립적인 공통 로직(shared/)을 테스트합니다. 숫자나 문자열을 입력하세요.
          </p>
          <div class="form-group">
            <label>Input Value</label>
            <input type="text" id="convert-input" placeholder="e.g. 255 or Hello">
          </div>
          <div class="button-group">
            <button class="primary" onclick="window.sharedController.convertToHex()">Convert to Hex</button>
          </div>
        </div>
      </div>`;
  }
}
