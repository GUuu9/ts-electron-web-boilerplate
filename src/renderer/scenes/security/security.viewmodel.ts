import { SecuritySceneService } from './securityTest.service.js';

/**
 * Security ViewModel
 */
export class SecurityViewModel {
  constructor(private readonly service: SecuritySceneService) {}

  public async generateAesKey() {
    try { return await this.service.aesGenerate(); } catch(e) { console.error(e); return null; }
  }

  public async testAes(text: string, keyHex: string) {
    try { return await this.service.testAes(text, keyHex); } catch(e) { console.error(e); return null; }
  }

  public async generateRsa() {
    try { return await this.service.rsaGenerate(); } catch(e) { console.error(e); return null; }
  }

  public async testRsa(text: string) {
    try { return await this.service.testRsa(text); } catch(e) { console.error(e); return null; }
  }

  public async testCompress(text: string) {
    try { return await this.service.testCompress(text); } catch(e) { console.error(e); return null; }
  }
}
