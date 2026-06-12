import * as crypto from 'crypto';

/**
 * RSA-OAEP 비대칭 암호화 유틸리티 (Main Process 전용)
 */
export class RsaOaepUtil {
  public static generateKeyPair(modulusLength: number = 2048) {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
  }

  public static encrypt(publicKey: string, data: Buffer): Buffer {
    return crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      data
    );
  }

  public static decrypt(privateKey: string, encryptedData: Buffer): Buffer {
    return crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      encryptedData
    );
  }
}
