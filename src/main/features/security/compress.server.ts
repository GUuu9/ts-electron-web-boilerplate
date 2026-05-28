import * as zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

/**
 * 데이터 압축 및 해제 유틸리티 (Gzip) - Main Process 전용
 */
export class CompressUtil {
  public static async compress(data: string | Buffer): Promise<Buffer> {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    return await gzip(buffer);
  }

  public static async decompress(compressedData: Buffer): Promise<string> {
    const decompressed = await gunzip(compressedData);
    return decompressed.toString('utf8');
  }
}
