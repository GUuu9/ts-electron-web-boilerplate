import { SecurityViewModel } from './security.viewmodel.js';

/**
 * Security View
 */
export class SecurityView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="shield-check"></i> Security & Compression Test</h3>
        
        <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
          <h4><i data-lucide="lock"></i> AES-256-GCM</h4>
          <button id="aes-gen-btn">Generate AES Key</button>
          <input type="text" id="aes-key" placeholder="AES Key (Hex)" style="width: 100%; margin: 5px 0;" />
          <input type="text" id="aes-input" value="Hello AES!" />
          <button id="aes-test-btn">Test AES</button>
          <div id="aes-result" style="font-size: 0.9em; color: #555; margin-top: 5px;"></div>
        </div>

        <div style="margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
          <h4><i data-lucide="key-round"></i> RSA-OAEP (2048bit)</h4>
          <button id="rsa-gen-btn">Generate RSA Keys</button>
          <input type="text" id="rsa-input" value="Hello RSA!" style="margin-top: 5px;" />
          <button id="rsa-test-btn">Test RSA</button>
          <div id="rsa-result" style="font-size: 0.9em; color: #555; margin-top: 5px;"></div>
        </div>

        <div>
          <h4><i data-lucide="package-minus"></i> Gzip Compression</h4>
          <textarea id="compress-input" style="width: 100%; height: 60px;">Repeat this text to see compression in action! Repeat this text to see compression in action!</textarea>
          <button id="compress-test-btn">Test Compression</button>
          <div id="compress-result" style="font-size: 0.9em; color: #555; margin-top: 5px;"></div>
        </div>
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
      if (target.id === 'aes-gen-btn') {
        const { aesKeyInput } = this.view.elements;
        const key = await this.viewModel.generateAesKey();
        if (aesKeyInput) aesKeyInput.value = key!.toString();
      }

      // AES Test
      if (target.id === 'aes-test-btn') {
        const { aesInput, aesKeyInput, aesResult } = this.view.elements;
        if (!aesKeyInput.value) {
          alert('Generate or enter AES key first!');
          return;
        }
        const res = await this.viewModel.testAes(aesInput.value, aesKeyInput.value);
        if (aesResult) aesResult.innerHTML = `Enc: ${res!.encrypted.substring(0, 30)}...<br>Dec: ${res!.decrypted}`;
      }

      // RSA Gen
      if (target.id === 'rsa-gen-btn') {
        await this.viewModel.generateRsa();
        alert('RSA Keys generated on Backend!');
      }

      // RSA Test
      if (target.id === 'rsa-test-btn') {
        const { rsaInput, rsaResult } = this.view.elements;
        try {
          const res = await this.viewModel.testRsa(rsaInput.value);
          if (rsaResult) rsaResult.innerHTML = `Enc (Base64): ${res!.encrypted.substring(0, 30)}...<br>Dec: ${res!.decrypted}`;
        } catch (e) {
          alert('Generate keys first!');
        }
      }

      // Compress
      if (target.id === 'compress-test-btn') {
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
