import { SecurityRepository } from '../../../../data/ipc/security/security.repository.js';

export class SecurityService {
  constructor(private repository: SecurityRepository) {}

  public async aesGenerate(): Promise<string> {
    return await this.repository.aesGenerate();
  }
  public async aesEncrypt(text: string, keyHex: string): Promise<string> {
    return await this.repository.aesEncrypt(text, keyHex);
  }
  public async aesDecrypt(enc: string, keyHex: string): Promise<string> {
    return await this.repository.aesDecrypt(enc, keyHex);
  }
  public async rsaGenerate(): Promise<any> {
    return await this.repository.rsaGenerate();
  }
  public async rsaEncrypt(text: string): Promise<string> {
    return await this.repository.rsaEncrypt(text);
  }
  public async rsaDecrypt(base64: string): Promise<string> {
    return await this.repository.rsaDecrypt(base64);
  }
  public async compress(text: string): Promise<any> {
    return await this.repository.compress(text);
  }
  public async decompress(base64: string): Promise<string> {
    return await this.repository.decompress(base64);
  }
}
