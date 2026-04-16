import Store from 'electron-store';
import * as crypto from 'crypto';
import 'dotenv/config';

/**
 * 암호화된 데이터 저장을 위한 서비스
 * AES-256-CBC 알고리즘 사용
 */
export class PersistenceService {
  private store: Store;
  // .env 파일의 SECRET_KEY를 사용, 없으면 기본값 사용
  private readonly secretKey: string = process.env.SECRET_KEY || 'default-fallback-key-32-chars!!'; 

  constructor() {
    this.store = new Store();
  }

  private encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.secretKey), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  }

  private decrypt(text: string): string {
    const [ivHex, encrypted] = text.split(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.secretKey), Buffer.from(ivHex, 'hex'));
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
