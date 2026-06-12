import { SecurityViewModel } from './security.viewmodel.js';
import securityTemplate from './security.view.html?raw';

/**
 * Security View
 */
export class SecurityView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = securityTemplate;
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
