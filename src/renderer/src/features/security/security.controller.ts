import { SecurityService } from '../../../../shared/security/security.service.js';
import type { UILogger } from '../../core/ui-logger.service.js';

/**
 * SecurityController
 * 역할: SecurityView와 SecurityService 사이의 가교 역할을 수행합니다.
 */
export class SecurityController {
  private rsaKeyPair: { publicKey: string; privateKey: string } | null = null;

  constructor(
    private securityService: SecurityService,
    private uiLogger: UILogger
  ) {}

  // --- [AES 테스트] ---

  /**
   * 32바이트 랜덤 AES 키를 생성합니다.
   */
  public generateRandomAesKey(): void {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    (document.getElementById('aes-key') as HTMLInputElement).value = result;
    this.uiLogger.log('[AES] New random 32-byte key generated', 'info');
  }

  public async testAesEncrypt(): Promise<void> {
    try {
      const input = (document.getElementById('aes-input') as HTMLInputElement).value;
      const key = (document.getElementById('aes-key') as HTMLInputElement).value;
      
      const result = await this.securityService.aesEncrypt(input, key);
      (document.getElementById('aes-result') as HTMLTextAreaElement).value = result;
      this.uiLogger.log(`[AES] Encrypted: ${input.substring(0, 10)}...`, 'info');
    } catch (e: any) {
      this.uiLogger.log(`[AES] Encryption Error: ${e.message}`, 'error');
    }
  }

  public async testAesDecrypt(): Promise<void> {
    try {
      const encrypted = (document.getElementById('aes-result') as HTMLTextAreaElement).value;
      const key = (document.getElementById('aes-key') as HTMLInputElement).value;
      
      const result = await this.securityService.aesDecrypt(encrypted, key);
      (document.getElementById('aes-result') as HTMLTextAreaElement).value = result;
      this.uiLogger.log(`[AES] Decrypted successfully`, 'info');
    } catch (e: any) {
      this.uiLogger.log(`[AES] Decryption Error: ${e.message}`, 'error');
    }
  }

  // --- [RSA 테스트] ---

  public async generateRsaKeys(): Promise<void> {
    try {
      const keySize = parseInt((document.getElementById('rsa-key-size') as HTMLSelectElement).value);
      this.rsaKeyPair = await this.securityService.rsaGenerateKeyPair(keySize);
      (document.getElementById('rsa-result') as HTMLTextAreaElement).value = 
        `[Public Key]\n${this.rsaKeyPair.publicKey}\n\n[Private Key]\n${this.rsaKeyPair.privateKey}`;
      this.uiLogger.log(`[RSA] Key pair generated (${keySize}-bit)`, 'info');
    } catch (e: any) {
      this.uiLogger.log(`[RSA] Key Generation Error: ${e.message}`, 'error');
    }
  }

  public async testRsaEncrypt(): Promise<void> {
    if (!this.rsaKeyPair) {
      this.uiLogger.log('[RSA] Please generate keys first!', 'warn');
      return;
    }
    try {
      const input = (document.getElementById('rsa-input') as HTMLInputElement).value;
      const result = await this.securityService.rsaEncrypt(input, this.rsaKeyPair.publicKey);
      (document.getElementById('rsa-result') as HTMLTextAreaElement).value = result;
      this.uiLogger.log('[RSA] Encrypted with Public Key', 'info');
    } catch (e: any) {
      this.uiLogger.log(`[RSA] Encryption Error: ${e.message}`, 'error');
    }
  }

  public async testRsaDecrypt(): Promise<void> {
    if (!this.rsaKeyPair) {
      this.uiLogger.log('[RSA] Keys not found!', 'error');
      return;
    }
    try {
      const encrypted = (document.getElementById('rsa-result') as HTMLTextAreaElement).value;
      const result = await this.securityService.rsaDecrypt(encrypted, this.rsaKeyPair.privateKey);
      (document.getElementById('rsa-result') as HTMLTextAreaElement).value = result;
      this.uiLogger.log('[RSA] Decrypted with Private Key', 'info');
    } catch (e: any) {
      this.uiLogger.log(`[RSA] Decryption Error: ${e.message}`, 'error');
    }
  }

  // --- [압축 테스트] ---

  public async testCompress(): Promise<void> {
    try {
      const input = (document.getElementById('zip-input') as HTMLTextAreaElement).value;
      const algo = (document.getElementById('zip-algo') as HTMLSelectElement).value as CompressionFormat;
      const originalSize = new TextEncoder().encode(input).length;
      
      const result = await this.securityService.compress(input, algo);
      const compressedSize = result.length / 2; // Hex -> Bytes
      
      (document.getElementById('zip-result') as HTMLTextAreaElement).value = result;
      
      const stats = document.getElementById('zip-stats') as HTMLElement;
      stats.style.display = 'inline-block';
      stats.innerText = `${algo.toUpperCase()} | Original: ${originalSize}B | Compressed: ${compressedSize}B | Ratio: ${((compressedSize/originalSize)*100).toFixed(1)}%`;
      
      this.uiLogger.log(`[Zip] Compressed (${algo}): ${originalSize}B -> ${compressedSize}B`, 'info');
    } catch (e: any) {
      this.uiLogger.log(`[Zip] Compression Error: ${e.message}`, 'error');
    }
  }

  public async testDecompress(): Promise<void> {
    try {
      const encrypted = (document.getElementById('zip-result') as HTMLTextAreaElement).value;
      const algo = (document.getElementById('zip-algo') as HTMLSelectElement).value as CompressionFormat;
      const result = await this.securityService.decompress(encrypted, algo);
      (document.getElementById('zip-result') as HTMLTextAreaElement).value = result;
      this.uiLogger.log(`[Zip] Decompressed (${algo}) successfully`, 'info');
    } catch (e: any) {
      this.uiLogger.log(`[Zip] Decompression Error: ${e.message}`, 'error');
    }
  }
}
