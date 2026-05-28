import * as crypto from 'crypto';

/**
 * AES-256-GCM 대칭 암호화 유틸리티 (Main Process 전용)
 */
export class AesGcmUtil {
  public static generateKey(): Buffer {
    return crypto.randomBytes(32);
  }

  public static encrypt(text: string, keyBuffer: Buffer): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', keyBuffer, iv) as crypto.CipherGCM;
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  public static decrypt(encryptedWithIv: string, keyBuffer: Buffer): string {
    const [ivHex, authTagHex, encrypted] = encryptedWithIv.split(':');
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm', 
      keyBuffer, 
      Buffer.from(ivHex, 'hex')
    ) as crypto.DecipherGCM;

    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
