import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { AesGcmUtil } from './aes-gcm.server.js';
import { RsaOaepUtil } from './rsa-oaep.server.js';
import { CompressUtil } from './compress.server.js';

/**
 * Security Core 모듈 (테스트용)
 */
export class SecurityCoreModule implements BackendModule {
  private rsaKeys: { publicKey: string; privateKey: string } | null = null;

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    // AES Test
    ipcMain.handle('test-aes-generate', () => {
      const key = AesGcmUtil.generateKey();
      return key.toString('hex');
    });
    ipcMain.handle('test-aes-encrypt', (_, text: string, keyHex: string) => {
      const key = Buffer.from(keyHex, 'hex');
      return AesGcmUtil.encrypt(text, key);
    });
    ipcMain.handle('test-aes-decrypt', (_, encrypted: string, keyHex: string) => {
      const key = Buffer.from(keyHex, 'hex');
      return AesGcmUtil.decrypt(encrypted, key);
    });

    // RSA Test
    ipcMain.handle('test-rsa-generate', (_, keyLength: number) => {
      this.rsaKeys = RsaOaepUtil.generateKeyPair(keyLength);
      return { publicKey: this.rsaKeys.publicKey };
    });
    ipcMain.handle('test-rsa-encrypt', (_, text: string) => {
      if (!this.rsaKeys) throw new Error('RSA Keys not generated');
      const encrypted = RsaOaepUtil.encrypt(this.rsaKeys.publicKey, Buffer.from(text));
      return encrypted.toString('base64');
    });
    ipcMain.handle('test-rsa-decrypt', (_, base64: string) => {
      if (!this.rsaKeys) throw new Error('RSA Keys not generated');
      const decrypted = RsaOaepUtil.decrypt(this.rsaKeys.privateKey, Buffer.from(base64, 'base64'));
      return decrypted.toString('utf8');
    });

    // Compress Test
    ipcMain.handle('test-compress', async (_, text: string, algo: 'gzip' | 'brotli') => {
      const compressed = await CompressUtil.compress(text, algo);
      return {
        base64: compressed.toString('base64'),
        originalSize: Buffer.from(text).length,
        compressedSize: compressed.length
      };
    });
    ipcMain.handle('test-decompress', async (_, base64: string, algo: 'gzip' | 'brotli') => {
      return await CompressUtil.decompress(Buffer.from(base64, 'base64'), algo);
    });
  }
}
