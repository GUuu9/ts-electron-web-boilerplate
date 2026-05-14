import { SecurityService } from '../../../../shared/security/security.service.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

/**
 * SecurityController
 * 역할: SecurityView와 SecurityService 사이의 가교 역할을 수행합니다.
 */
export class SecurityController {
  private rsaKeyPair: { publicKey: string; privateKey: string } | null = null;

  constructor(
    private securityService: SecurityService,
    private logger: UILoggerService
  ) {}

  // --- [공통 유틸리티] ---

  /**
   * 특정 필드의 형식을 Text <-> HEX로 전환합니다.
   * @param elementId 필드 ID
   * @param toHex HEX로 변환할지 여부
   */
  public toggleFieldFormat(elementId: string, toHex: boolean): void {
    const el = document.getElementById(elementId) as HTMLInputElement | HTMLTextAreaElement;
    const value = el.value;
    if (!value) return;

    try {
      if (toHex) {
        // Text -> HEX
        const bytes = new TextEncoder().encode(value);
        let hex = '';
        for (const b of bytes) hex += b.toString(16).padStart(2, '0');
        el.value = hex;
      } else {
        // HEX -> Text (공백이나 콜론 제거 후 변환)
        const cleanHex = value.replace(/[:\s]/g, '');
        if (cleanHex.length % 2 !== 0) throw new Error('Invalid HEX length');
        
        const bytes = new Uint8Array(cleanHex.length / 2);
        for (let i = 0; i < cleanHex.length; i += 2) {
          bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
        }
        el.value = new TextDecoder().decode(bytes);
      }
    } catch (e: any) {
      this.logger.log(`[Format] Conversion Error: ${e.message}`, true);
      // 실패 시 체크박스 상태 복구는 View에서 처리하거나 그대로 둠
    }
  }

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
    this.logger.log('[AES] New random 32-byte key generated');
  }

  public async testAesEncrypt(): Promise<void> {
    try {
      const input = (document.getElementById('aes-input') as HTMLInputElement).value;
      const key = (document.getElementById('aes-key') as HTMLInputElement).value;
      
      const result = await this.securityService.aesEncrypt(input, key);
      (document.getElementById('aes-result') as HTMLTextAreaElement).value = result;
      this.logger.log(`[AES] Encrypted: ${input.substring(0, 10)}...`);
    } catch (e: any) {
      this.logger.log(`[AES] Encryption Error: ${e.message}`, true);
    }
  }

  public async testAesDecrypt(): Promise<void> {
    try {
      const encrypted = (document.getElementById('aes-result') as HTMLTextAreaElement).value;
      const key = (document.getElementById('aes-key') as HTMLInputElement).value;
      
      const result = await this.securityService.aesDecrypt(encrypted, key);
      (document.getElementById('aes-result') as HTMLTextAreaElement).value = result;
      this.logger.log(`[AES] Decrypted successfully`);
    } catch (e: any) {
      this.logger.log(`[AES] Decryption Error: ${e.message}`, true);
    }
  }

  // --- [RSA 테스트] ---

  public async generateRsaKeys(): Promise<void> {
    try {
      const keySize = parseInt((document.getElementById('rsa-key-size') as HTMLSelectElement).value);
      this.rsaKeyPair = await this.securityService.rsaGenerateKeyPair(keySize);

      const pubHex = this.rsaKeyPair.publicKey;
      const privHex = this.rsaKeyPair.privateKey;
      const pubPem = this.securityService.hexToPem(pubHex, 'PUBLIC KEY');
      const privPem = this.securityService.hexToPem(privHex, 'PRIVATE KEY');

      (document.getElementById('rsa-result') as HTMLTextAreaElement).value = 
        `[Public Key - HEX]\n${pubHex}\n\n[Public Key - PEM]\n${pubPem}\n\n` +
        `[Private Key - HEX]\n${privHex}\n\n[Private Key - PEM]\n${privPem}`;

      this.logger.log(`[RSA] Key pair generated (${keySize}-bit)`);
    } catch (e: any) {
      this.logger.log(`[RSA] Key Generation Error: ${e.message}`, true);
    }
  }

  public async testRsaEncrypt(): Promise<void> {
    if (!this.rsaKeyPair) {
      this.logger.log('[RSA] Please generate keys first!');
      return;
    }
    try {
      const input = (document.getElementById('rsa-input') as HTMLInputElement).value;
      const result = await this.securityService.rsaEncrypt(input, this.rsaKeyPair.publicKey);
      (document.getElementById('rsa-result') as HTMLTextAreaElement).value = result;
      this.logger.log('[RSA] Encrypted with Public Key');
    } catch (e: any) {
      this.logger.log(`[RSA] Encryption Error: ${e.message}`, true);
    }
  }

  public async testRsaDecrypt(): Promise<void> {
    if (!this.rsaKeyPair) {
      this.logger.log('[RSA] Keys not found!', true);
      return;
    }
    try {
      const encrypted = (document.getElementById('rsa-result') as HTMLTextAreaElement).value;
      const result = await this.securityService.rsaDecrypt(encrypted, this.rsaKeyPair.privateKey);
      (document.getElementById('rsa-result') as HTMLTextAreaElement).value = result;
      this.logger.log('[RSA] Decrypted with Private Key');
    } catch (e: any) {
      this.logger.log(`[RSA] Decryption Error: ${e.message}`, true);
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
      
      this.logger.log(`[Zip] Compressed (${algo}): ${originalSize}B -> ${compressedSize}B`);
    } catch (e: any) {
      this.logger.log(`[Zip] Compression Error: ${e.message}`, true);
    }
  }

  public async testDecompress(): Promise<void> {
    try {
      const encrypted = (document.getElementById('zip-result') as HTMLTextAreaElement).value;
      const algo = (document.getElementById('zip-algo') as HTMLSelectElement).value as CompressionFormat;
      const result = await this.securityService.decompress(encrypted, algo);
      (document.getElementById('zip-result') as HTMLTextAreaElement).value = result;
      this.logger.log(`[Zip] Decompressed (${algo}) successfully`);
    } catch (e: any) {
      this.logger.log(`[Zip] Decompression Error: ${e.message}`, true);
    }
  }
}
