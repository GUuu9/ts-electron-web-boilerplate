import { SecurityRepository } from '../../data/security/security.repository.js';

/**
 * Security ViewModel
 */
export class SecurityViewModel {
  constructor(private readonly repository: SecurityRepository) {}

  public async generateAesKey() {
    return await this.repository.aesGenerate();
  }

  public async testAes(text: string, keyHex: string) {
    const encrypted = await this.repository.aesEncrypt(text, keyHex);
    const decrypted = await this.repository.aesDecrypt(encrypted, keyHex);
    return { encrypted, decrypted };
  }

  public async generateRsa() {
    return await this.repository.rsaGenerate();
  }

  public async testRsa(text: string) {
    const encrypted = await this.repository.rsaEncrypt(text);
    const decrypted = await this.repository.rsaDecrypt(encrypted);
    return { encrypted, decrypted };
  }

  public async testCompress(text: string) {
    const info = await this.repository.compress(text);
    const decompressed = await this.repository.decompress(info.base64);
    return { ...info, decompressed };
  }
}
