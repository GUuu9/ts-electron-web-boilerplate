import { SecurityRepository } from '../../../data/ipc/security/security.repository.js';

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
  public async rsaGenerate(keyLength: number): Promise<any> {
    return await this.repository.rsaGenerate(keyLength);
  }
  public async rsaEncrypt(text: string): Promise<string> {
    return await this.repository.rsaEncrypt(text);
  }
  public async rsaDecrypt(base64: string): Promise<string> {
    return await this.repository.rsaDecrypt(base64);
  }
  public async compress(text: string, algo: 'gzip' | 'brotli'): Promise<any> {
    return await this.repository.compress(text, algo);
  }
  public async decompress(base64: string, algo: 'gzip' | 'brotli'): Promise<string> {
    return await this.repository.decompress(base64, algo);
  }
}
