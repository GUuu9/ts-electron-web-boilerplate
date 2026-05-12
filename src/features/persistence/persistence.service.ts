import Store from 'electron-store';
import * as crypto from 'crypto';
import 'dotenv/config';

/**
 * 암호화된 데이터 저장을 위한 서비스
 * AES-256-GCM 알고리즘 사용 (무결성 검증 포함)
 */
export class PersistenceService {
  private store: Store;
  // .env 파일의 SECRET_KEY를 사용, 반드시 32바이트여야 함
  private readonly secretKey: Buffer;

  constructor() {
    this.store = new Store();
    const rawKey = process.env.SECRET_KEY || 'default-fallback-key-32-chars-!!';
    // 키 길이를 32바이트로 강제 조정 (AES-256용)
    this.secretKey = Buffer.alloc(32, rawKey).slice(0, 32);
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(12); // GCM 권장 IV 길이는 12바이트
    const cipher = crypto.createCipheriv('aes-256-gcm', this.secretKey, iv) as crypto.CipherGCM;
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    // IV : AuthTag : EncryptedData 형식으로 저장
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  private decrypt(text: string): string {
    const [ivHex, authTagHex, encrypted] = text.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm', 
      this.secretKey, 
      Buffer.from(ivHex, 'hex')
    ) as crypto.DecipherGCM;

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  public set(key: string, value: any): void {
    const jsonStr = JSON.stringify(value);
    this.store.set(key, this.encrypt(jsonStr));
  }

  public get(key: string): any {
    const encrypted = this.store.get(key) as string;
    if (!encrypted) return null;
    try {
      return JSON.parse(this.decrypt(encrypted));
    } catch (e) {
      console.error('Decryption failed:', e);
      return null;
    }
  }
}
