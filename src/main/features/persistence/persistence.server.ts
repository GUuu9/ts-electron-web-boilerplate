import Store from 'electron-store';
import 'dotenv/config';
import { AesGcmUtil } from '../security/aes-gcm.server.js';
import { CompressUtil } from '../security/compress.server.js';

/**
 * 암호화 및 압축이 적용된 데이터 저장 서비스 (Backend Server)
 */
export class PersistenceServer {
  private store: Store;
  private readonly secretKey: Buffer;

  constructor() {
    this.store = new Store();
    const rawKey = process.env.SECRET_KEY || 'default-fallback-key-32-chars-!!';
    this.secretKey = Buffer.alloc(32, rawKey).slice(0, 32);
  }

  public async save(key: string, value: any): Promise<void> {
    const jsonStr = JSON.stringify(value);
    
    // 1. 압축
    const compressed = await CompressUtil.compress(jsonStr);
    
    // 2. 암호화 (바이너리를 hex로 변환하여 저장하거나 base64 사용 가능, 여기선 hex 문자열 처리)
    const encrypted = AesGcmUtil.encrypt(compressed.toString('hex'), this.secretKey);
    
    this.store.set(key, encrypted);
  }

  public async load(key: string): Promise<any> {
    const encrypted = this.store.get(key) as string;
    if (!encrypted) return null;

    try {
      // 1. 복호화
      const decryptedHex = AesGcmUtil.decrypt(encrypted, this.secretKey);
      
      // 2. 압축 해제
      const decompressed = await CompressUtil.decompress(Buffer.from(decryptedHex, 'hex'));
      
      return JSON.parse(decompressed);
    } catch (e) {
      console.error('[PersistenceServer] Data retrieval failed:', e);
      return null;
    }
  }
}
