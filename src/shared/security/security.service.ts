/**
 * SecurityService (Shared)
 * 역할: AES-256-GCM 암호화, RSA-OAEP 키 교환, 데이터 압축 기능을 제공합니다.
 * 특징: Node.js와 Browser 환경에서 공통으로 지원하는 표준 Web Crypto API 및 CompressionStream API를 사용합니다.
 */
export class SecurityService {
  // --- [공통 유틸리티] ---

  /**
   * 문자열을 Uint8Array로 변환합니다.
   */
  private textToBytes(text: string): Uint8Array {
    return new TextEncoder().encode(text);
  }

  /**
   * Uint8Array를 문자열로 변환합니다.
   */
  private bytesToText(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
  }

  /**
   * Uint8Array를 Hex 문자열로 변환합니다.
   */
  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Hex 문자열을 Uint8Array로 변환합니다.
   */
  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    return bytes;
  }

  /**
   * Hex 문자열을 PEM 포맷으로 변환합니다.
   * @param hex 변환할 Hex 문자열
   * @param label PEM 라벨 (PUBLIC KEY 또는 PRIVATE KEY)
   */
  public hexToPem(hex: string, label: 'PUBLIC KEY' | 'PRIVATE KEY'): string {
    const bytes = this.hexToBytes(hex);
    // Uint8Array -> Binary String
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    // Binary String -> Base64
    const base64 = btoa(binary);
    // 64글자씩 줄바꿈
    const matches = base64.match(/.{1,64}/g);
    const formatted = matches ? matches.join('\n') : base64;

    return `-----BEGIN ${label}-----\n${formatted}\n-----END ${label}-----`;
  }

  // --- [AES-256-GCM 암호화] ---

  /**
   * AES-256-GCM 알고리즘으로 데이터를 암호화합니다.
   * @param text 암호화할 평문
   * @param key 32바이트(256비트) 암호 키 (Hex 또는 string)
   * @returns "iv:encryptedData" 형식의 Hex 문자열 (GCM의 Auth Tag는 데이터 끝에 포함됨)
   */
  public async aesEncrypt(text: string, key: string): Promise<string> {
    const crypto = globalThis.crypto;
    const rawKey = this.textToBytes(key.padEnd(32, '0')).slice(0, 32);
    const aesKey = await crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      this.textToBytes(text)
    );

    const encryptedBytes = new Uint8Array(encrypted);
    return `${this.bytesToHex(iv)}:${this.bytesToHex(encryptedBytes)}`;
  }

  /**
   * AES-256-GCM 알고리즘으로 데이터를 복호화합니다.
   * @param encryptedData "iv:encryptedData" 형식의 Hex 문자열
   * @param key 암호 키
   */
  public async aesDecrypt(encryptedData: string, key: string): Promise<string> {
    const [ivHex, dataHex] = encryptedData.split(':');
    if (!ivHex || !dataHex) throw new Error('Invalid encrypted data format');

    const crypto = globalThis.crypto;
    const rawKey = this.textToBytes(key.padEnd(32, '0')).slice(0, 32);
    const aesKey = await crypto.subtle.importKey(
      'raw',
      rawKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    const iv = this.hexToBytes(ivHex);
    const data = this.hexToBytes(dataHex);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      data
    );

    return this.bytesToText(new Uint8Array(decrypted));
  }

  // --- [RSA-OAEP 키 교환] ---

  /**
   * RSA-OAEP 키쌍을 생성합니다.
   * @param keySize 키 길이 (1024, 2048, 4096 bits - 기본값: 2048)
   * @returns { publicKey, privateKey } (SPKI/PKCS8 포맷의 Hex 문자열)
   */
  public async rsaGenerateKeyPair(keySize: number = 2048): Promise<{ publicKey: string; privateKey: string }> {
    const crypto = globalThis.crypto;
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: keySize,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256',
      },
      true,
      ['encrypt', 'decrypt']
    );

    const pub = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const priv = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: this.bytesToHex(new Uint8Array(pub)),
      privateKey: this.bytesToHex(new Uint8Array(priv)),
    };
  }

  /**
   * RSA 공개키로 데이터를 암호화합니다. (주로 AES 키 교환용)
   */
  public async rsaEncrypt(text: string, publicKeyHex: string): Promise<string> {
    const crypto = globalThis.crypto;
    const pubKey = await crypto.subtle.importKey(
      'spki',
      this.hexToBytes(publicKeyHex),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt']
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      pubKey,
      this.textToBytes(text)
    );

    return this.bytesToHex(new Uint8Array(encrypted));
  }

  /**
   * RSA 개인키로 데이터를 복호화합니다.
   */
  public async rsaDecrypt(encryptedHex: string, privateKeyHex: string): Promise<string> {
    const crypto = globalThis.crypto;
    const privKey = await crypto.subtle.importKey(
      'pkcs8',
      this.hexToBytes(privateKeyHex),
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['decrypt']
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      privKey,
      this.hexToBytes(encryptedHex)
    );

    return this.bytesToText(new Uint8Array(decrypted));
  }

  // --- [데이터 압축] ---

  /**
   * 데이터를 지정된 알고리즘으로 압축합니다.
   * @param text 압축할 평문
   * @param algorithm 'gzip' | 'deflate' | 'deflate-raw' (기본값: deflate)
   */
  public async compress(text: string, algorithm: CompressionFormat = 'deflate'): Promise<string> {
    const bytes = this.textToBytes(text);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });

    const compressionStream = new CompressionStream(algorithm);
    const compressedStream = stream.pipeThrough(compressionStream);
    const reader = compressedStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return this.bytesToHex(result);
  }

  /**
   * 압축된 데이터를 지정된 알고리즘으로 해제합니다.
   * @param compressedHex 압축된 Hex 문자열
   * @param algorithm 'gzip' | 'deflate' | 'deflate-raw' (기본값: deflate)
   */
  public async decompress(compressedHex: string, algorithm: CompressionFormat = 'deflate'): Promise<string> {
    const bytes = this.hexToBytes(compressedHex);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });

    const decompressionStream = new DecompressionStream(algorithm);
    const decompressedStream = stream.pipeThrough(decompressionStream);
    const reader = decompressedStream.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return this.bytesToText(result);
  }
}
