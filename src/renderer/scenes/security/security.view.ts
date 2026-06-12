import { SecurityViewModel } from './security.viewmodel.js';

/**
 * Security View
 */
export class SecurityView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container security-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="shield-check"></i> Security & Compression Test</h3>
        </header>
        
        <section class="view-content" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- AES Section -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
            <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);"><i data-lucide="lock"></i> AES-256-GCM</h4>
            <button id="aes-gen-btn" class="btn btn-outline" style="width: fit-content;">Generate AES Key</button>
            <input type="text" id="aes-key" placeholder="AES Key (Hex)" />
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="aes-input" value="Hello AES!" style="flex: 1;" />
              <button id="aes-test-btn" class="btn btn-primary">Test AES</button>
            </div>
            <div id="aes-result" style="background: var(--input-bg); border: 1px solid var(--border); padding: 0.5rem; border-radius: 0.5rem; font-size: 0.85rem; color: var(--text-dim);"></div>
          </div>

          <!-- RSA Section -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1rem;">
            <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);"><i data-lucide="key-round"></i> RSA-OAEP (2048bit)</h4>
            <button id="rsa-gen-btn" class="btn btn-outline" style="width: fit-content;">Generate RSA Keys</button>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="rsa-input" value="Hello RSA!" style="flex: 1;" />
              <button id="rsa-test-btn" class="btn btn-primary">Test RSA</button>
            </div>
            <div id="rsa-result" style="background: var(--input-bg); border: 1px solid var(--border); padding: 0.5rem; border-radius: 0.5rem; font-size: 0.85rem; color: var(--text-dim);"></div>
          </div>

          <!-- Compression Section -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);"><i data-lucide="package-minus"></i> Gzip Compression</h4>
            <textarea id="compress-input" style="height: 60px;">Repeat this text to see compression in action! Repeat this text to see compression in action!</textarea>
            <button id="compress-test-btn" class="btn btn-primary" style="width: fit-content;">Test Compression</button>
            <div id="compress-result" style="background: var(--input-bg); border: 1px solid var(--border); padding: 0.5rem; border-radius: 0.5rem; font-size: 0.85rem; color: var(--text-dim);"></div>
          </div>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get aesKeyInput() { return document.getElementById('aes-key') as HTMLInputElement; },
      get aesGenBtn() { return document.getElementById('aes-gen-btn'); },
      get aesInput() { return document.getElementById('aes-input') as HTMLInputElement; },
      get aesBtn() { return document.getElementById('aes-test-btn'); },
      get aesResult() { return document.getElementById('aes-result'); },

      get rsaGenBtn() { return document.getElementById('rsa-gen-btn'); },
      get rsaInput() { return document.getElementById('rsa-input') as HTMLInputElement; },
      get rsaBtn() { return document.getElementById('rsa-test-btn'); },
      get rsaResult() { return document.getElementById('rsa-result'); },

      get compInput() { return document.getElementById('compress-input') as HTMLTextAreaElement; },
      get compBtn() { return document.getElementById('compress-test-btn'); },
      get compResult() { return document.getElementById('compress-result'); }
    };
  }
}

/**
 * Security Binder
 */
export class SecurityBinder {
  constructor(
    private readonly view: SecurityView,
    private readonly viewModel: SecurityViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;

      // AES Gen
      if (target.id === 'aes-gen-btn' || target.closest('#aes-gen-btn')) {
        const { aesKeyInput } = this.view.elements;
        const key = await this.viewModel.generateAesKey();
        if (aesKeyInput) aesKeyInput.value = key!.toString();
      }

      // AES Test
      if (target.id === 'aes-test-btn' || target.closest('#aes-test-btn')) {
        const { aesInput, aesKeyInput, aesResult } = this.view.elements;
        if (!aesKeyInput.value) {
          alert('Generate or enter AES key first!');
          return;
        }
        const res = await this.viewModel.testAes(aesInput.value, aesKeyInput.value);
        if (aesResult) aesResult.innerHTML = `Enc: ${res!.encrypted.substring(0, 30)}...<br>Dec: ${res!.decrypted}`;
      }

      // RSA Gen
      if (target.id === 'rsa-gen-btn' || target.closest('#rsa-gen-btn')) {
        await this.viewModel.generateRsa();
        alert('RSA Keys generated on Backend!');
      }

      // RSA Test
      if (target.id === 'rsa-test-btn' || target.closest('#rsa-test-btn')) {
        const { rsaInput, rsaResult } = this.view.elements;
        try {
          const res = await this.viewModel.testRsa(rsaInput.value);
          if (rsaResult) rsaResult.innerHTML = `Enc (Base64): ${res!.encrypted.substring(0, 30)}...<br>Dec: ${res!.decrypted}`;
        } catch (e) {
          alert('Generate keys first!');
        }
      }

      // Compress
      if (target.id === 'compress-test-btn' || target.closest('#compress-test-btn')) {
        const { compInput, compResult } = this.view.elements;
        const res = await this.viewModel.testCompress(compInput.value);
        if (compResult) {
          compResult.innerHTML = `
            Original: ${res.originalSize} bytes<br>
            Compressed: ${res.compressedSize} bytes (${((res.compressedSize / res.originalSize) * 100).toFixed(1)}%)<br>
            Decompressed: ${res.decompressed.substring(0, 30)}...
          `;
        }
      }
    });
  }
}
