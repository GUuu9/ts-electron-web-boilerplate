/**
 * Security Repository
 */
export class SecurityRepository {
  private get security() {
    if (!(window as any).electronAPI?.security) {
      throw new Error('[SecurityRepository] Security API not available.');
    }
    return (window as any).electronAPI.security;
  }

  public async aesGenerate(): Promise<string> {
    try { return await this.security.aesGenerate(); } catch { return ''; }
  }
  public async aesEncrypt(text: string, keyHex: string): Promise<string> {
    try { return await this.security.aesEncrypt(text, keyHex); } catch { return ''; }
  }
  public async aesDecrypt(enc: string, keyHex: string): Promise<string> {
    try { return await this.security.aesDecrypt(enc, keyHex); } catch { return ''; }
  }
  public async rsaGenerate(keyLength: number): Promise<any> {
    try { return await this.security.rsaGenerate(keyLength); } catch { return null; }
  }
  public async rsaEncrypt(text: string): Promise<string> {
    try { return await this.security.rsaEncrypt(text); } catch { return ''; }
  }
  public async rsaDecrypt(base64: string): Promise<string> {
    try { return await this.security.rsaDecrypt(base64); } catch { return ''; }
  }
  public async compress(text: string, algo: 'gzip' | 'brotli'): Promise<any> {
    try { return await this.security.compress(text, algo); } catch { return null; }
  }
  public async decompress(base64: string, algo: 'gzip' | 'brotli'): Promise<string> {
    try { return await this.security.decompress(base64, algo); } catch { return ''; }
  }
}
