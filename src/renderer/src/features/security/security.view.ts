/**
 * SecurityView
 * 역할: AES, RSA, Compression 기능을 테스트하기 위한 UI 템플릿을 제공합니다.
 * 프로젝트 표준 디자인 시스템(test-form, test-section)을 준수합니다.
 */
export class SecurityView {
  public render(): string {
    return `
      <div class="test-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          
          <!-- AES-256-GCM Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="shield-check" style="color: var(--secondary); width: 20px;"></i>
              <h5 style="margin: 0; color: var(--secondary);">AES-256-GCM (Symmetric)</h5>
            </div>
            
            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label>Plain Text Message</label>
                <div style="font-size: 0.7rem; color: var(--secondary); display: flex; align-items: center; gap: 4px;">
                  <input type="checkbox" id="toggle-aes-input" onchange="window.securityController.toggleFieldFormat('aes-input', this.checked)">
                  <label for="toggle-aes-input" style="margin: 0; cursor: pointer;">HEX View</label>
                </div>
              </div>
              <input type="text" id="aes-input" placeholder="Enter message to encrypt" value="Hello, Gemini Framework!" style="padding: 10px;">
            </div>
            
            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label>Secret Key (32 characters)</label>
                <div style="font-size: 0.7rem; color: var(--secondary); display: flex; align-items: center; gap: 4px;">
                  <input type="checkbox" id="toggle-aes-key" onchange="window.securityController.toggleFieldFormat('aes-key', this.checked)">
                  <label for="toggle-aes-key" style="margin: 0; cursor: pointer;">HEX View</label>
                </div>
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: stretch;">
                <input type="text" id="aes-key" maxlength="32" placeholder="32-byte key" value="my-secret-key-12345678901234567" style="flex: 1; min-width: 0; padding: 10px;">
                <button class="primary" style="display: flex; align-items: center; gap: 8px; padding: 0 16px; background: rgba(139, 92, 246, 0.1); border: 1px solid var(--secondary); color: var(--secondary); border-radius: 6px;" onclick="window.securityController.generateRandomAesKey()">
                  <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                  <span style="font-size: 0.8rem; font-weight: 500;">Random</span>
                </button>
              </div>
              <p style="font-size: 0.7rem; color: var(--text-dim); margin-top: 0.5rem;">* AES-256 requires exactly 32 bytes.</p>
            </div>

            <div class="button-group" style="margin-top: 1.5rem; gap: 0.75rem;">
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px;" onclick="window.securityController.testAesEncrypt()">
                <i data-lucide="lock" style="width: 14px; height: 14px;"></i> <span>Encrypt</span>
              </button>
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: var(--bg-card); border: 1px solid var(--secondary);" onclick="window.securityController.testAesDecrypt()">
                <i data-lucide="unlock" style="width: 14px; height: 14px;"></i> <span>Decrypt</span>
              </button>
            </div>

            <div class="form-group" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label>Resulting Data (IV : CipherText)</label>
                <div style="font-size: 0.7rem; color: var(--secondary); display: flex; align-items: center; gap: 4px;">
                  <input type="checkbox" id="toggle-aes-result" checked onchange="window.securityController.toggleFieldFormat('aes-result', this.checked)">
                  <label for="toggle-aes-result" style="margin: 0; cursor: pointer;">HEX View</label>
                </div>
              </div>
              <textarea id="aes-result" style="height: 80px; font-family: monospace; font-size: 0.8rem; padding: 10px; line-height: 1.4;" readonly></textarea>
            </div>
          </div>

          <!-- RSA-OAEP Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="key" style="color: #10b981; width: 20px;"></i>
              <h5 style="margin: 0; color: #10b981;">RSA-OAEP (Asymmetric)</h5>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label>Key Length (Bits)</label>
              <select id="rsa-key-size" class="primary" style="width: 100%; background: var(--bg-card); border: 1px solid #10b981; color: #10b981; padding: 10px; border-radius: 6px; cursor: pointer; margin-bottom: 1rem;">
                <option value="1024">1024 bits (Legacy/Fast)</option>
                <option value="2048" selected>2048 bits (Standard/Secure)</option>
                <option value="4096">4096 bits (High Security/Slow)</option>
              </select>
              <button class="primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: #059669;" onclick="window.securityController.generateRsaKeys()">
                <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i> <span>Generate New Key Pair</span>
              </button>
            </div>

            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label>Data to Exchange (e.g. Session Key)</label>
                <div style="font-size: 0.7rem; color: #10b981; display: flex; align-items: center; gap: 4px;">
                  <input type="checkbox" id="toggle-rsa-input" onchange="window.securityController.toggleFieldFormat('rsa-input', this.checked)">
                  <label for="toggle-rsa-input" style="margin: 0; cursor: pointer;">HEX View</label>
                </div>
              </div>
              <input type="text" id="rsa-input" placeholder="Secure payload" value="Confidential Session Key 9901" style="padding: 10px;">
            </div>

            <div class="button-group" style="margin-top: 1.5rem; gap: 0.75rem;">
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: #10b981;" onclick="window.securityController.testRsaEncrypt()">
                <i data-lucide="user-check" style="width: 14px; height: 14px;"></i> <span>Encrypt (Public)</span>
              </button>
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px; background: var(--bg-card); border: 1px solid #10b981;" onclick="window.securityController.testRsaDecrypt()">
                <i data-lucide="key-round" style="width: 14px; height: 14px;"></i> <span>Decrypt (Private)</span>
              </button>
            </div>

            <div class="form-group" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label>RSA Output / Key Info (HEX & PEM)</label>
                <div style="font-size: 0.7rem; color: #10b981; display: flex; align-items: center; gap: 4px;">
                  <input type="checkbox" id="toggle-rsa-result" checked onchange="window.securityController.toggleFieldFormat('rsa-result', this.checked)">
                  <label for="toggle-rsa-result" style="margin: 0; cursor: pointer;">HEX View</label>
                </div>
              </div>
              <textarea id="rsa-result" style="height: 200px; font-family: monospace; font-size: 0.75rem; padding: 10px; word-break: break-all; line-height: 1.4;" readonly></textarea>
            </div>
          </div>

        </div>

        <!-- Compression Section (Full Width) -->
        <div class="test-section" style="margin-top: 1.5rem; background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="archive" style="color: #f59e0b; width: 20px;"></i>
            <h5 style="margin: 0; color: #f59e0b;">Data Compression (Multi-Algorithm)</h5>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 350px; gap: 1.5rem; margin-bottom: 1rem;">
            <div class="form-group">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label>Large Payload to Compress</label>
                <div style="font-size: 0.7rem; color: #f59e0b; display: flex; align-items: center; gap: 4px;">
                  <input type="checkbox" id="toggle-zip-input" onchange="window.securityController.toggleFieldFormat('zip-input', this.checked)">
                  <label for="toggle-zip-input" style="margin: 0; cursor: pointer;">HEX View</label>
                </div>
              </div>
              <textarea id="zip-input" style="height: 120px; padding: 10px; line-height: 1.5;">이 텍스트는 암호화 전송 시 전송량을 줄이기 위해 압축됩니다. 
반복되는 데이터가 많을수록 압축 효율이 높아집니다.
로그 데이터나 대용량 JSON 전송 시 필수적으로 사용되는 기능입니다.
[REPEAT] TEST DATA TEST DATA TEST DATA TEST DATA TEST DATA
[REPEAT] TEST DATA TEST DATA TEST DATA TEST DATA TEST DATA</textarea>
            </div>
            
            <div class="form-group">
              <label>Compression Algorithm</label>
              <select id="zip-algo" class="primary" style="width: 100%; background: var(--bg-card); border: 1px solid #f59e0b; color: #f59e0b; padding: 10px; border-radius: 6px; cursor: pointer; margin-bottom: 1rem;">
                <option value="deflate" selected>Deflate (Zlib / RFC 1950)</option>
                <option value="gzip">Gzip (Web / RFC 1952)</option>
                <option value="deflate-raw">Deflate Raw (No Header / RFC 1951)</option>
              </select>
              <div style="background: rgba(245, 158, 11, 0.05); padding: 12px; border-radius: 6px; border: 1px dashed rgba(245, 158, 11, 0.2);">
                <p style="font-size: 0.75rem; color: #fbbf24; margin: 0; line-height: 1.6;">
                  <b>Gzip</b>: 웹 서버/브라우저 표준 규격<br>
                  <b>Deflate</b>: Zlib 헤더를 포함한 표준<br>
                  <b>Raw</b>: 헤더 없는 순수 데이터 압축
                </p>
              </div>
            </div>
          </div>

          <div class="button-group" style="margin-top: 1rem; gap: 0.75rem;">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; background: #d97706;" onclick="window.securityController.testCompress()">
              <i data-lucide="file-down" style="width: 14px; height: 14px;"></i> <span>Compress</span>
            </button>
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; background: var(--bg-card); border: 1px solid #d97706;" onclick="window.securityController.testDecompress()">
              <i data-lucide="file-up" style="width: 14px; height: 14px;"></i> <span>Decompress</span>
            </button>
            <div id="zip-stats" class="status-badge" style="display: none; align-self: center; margin-left: 1rem; padding: 6px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 500; background: rgba(245, 158, 11, 0.2); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3);"></div>
          </div>

          <div class="form-group" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
              <label>Compressed Result (Hex)</label>
              <div style="font-size: 0.7rem; color: #f59e0b; display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" id="toggle-zip-result" checked onchange="window.securityController.toggleFieldFormat('zip-result', this.checked)">
                <label for="toggle-zip-result" style="margin: 0; cursor: pointer;">HEX View</label>
              </div>
            </div>
            <textarea id="zip-result" style="height: 100px; font-family: monospace; font-size: 0.8rem; padding: 10px;" readonly></textarea>
          </div>
        </div>
      </div>
    `;
  }
}
