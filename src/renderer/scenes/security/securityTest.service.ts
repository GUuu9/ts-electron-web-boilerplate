import { SecurityService } from '../../domains/security/services/security.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class SecuritySceneService {
  constructor(
    private service: SecurityService,
    private loggerService: LoggerService
  ) {}

  public async aesGenerate(): Promise<string> {
    await this.loggerService.log('INFO', 'AES 키 생성');
    try { return await this.service.aesGenerate(); } catch(e) { await this.loggerService.log('ERROR', `AES 생성 실패: ${e}`); throw e; }
  }

  public async testAes(text: string, keyHex: string) {
    await this.loggerService.log('INFO', 'AES 테스트 시작');
    try {
      const encrypted = await this.service.aesEncrypt(text, keyHex);
      const decrypted = await this.service.aesDecrypt(encrypted, keyHex);
      return { encrypted, decrypted };
    } catch(e) {
      await this.loggerService.log('ERROR', `AES 테스트 실패: ${e}`);
      throw e;
    }
  }

  public async rsaGenerate(): Promise<any> {
    await this.loggerService.log('INFO', 'RSA 키 생성');
    try { return await this.service.rsaGenerate(); } catch(e) { await this.loggerService.log('ERROR', `RSA 생성 실패: ${e}`); throw e; }
  }

  public async testRsa(text: string) {
    await this.loggerService.log('INFO', 'RSA 테스트 시작');
    try {
      const encrypted = await this.service.rsaEncrypt(text);
      const decrypted = await this.service.rsaDecrypt(encrypted);
      return { encrypted, decrypted };
    } catch(e) {
      await this.loggerService.log('ERROR', `RSA 테스트 실패: ${e}`);
      throw e;
    }
  }

  public async testCompress(text: string) {
    await this.loggerService.log('INFO', '압축 테스트 시작');
    try {
      const info = await this.service.compress(text);
      const decompressed = await this.service.decompress(info.base64);
      return { ...info, decompressed };
    } catch(e) {
      await this.loggerService.log('ERROR', `압축 테스트 실패: ${e}`);
      throw e;
    }
  }
}
