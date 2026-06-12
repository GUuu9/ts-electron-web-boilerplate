import * as zlib from 'zlib';
import { promisify } from 'util';
import { Buffer } from 'buffer';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);
const brotliCompress = promisify(zlib.brotliCompress);
const brotliDecompress = promisify(zlib.brotliDecompress);

/**
 * 데이터 압축 및 해제 유틸리티 (Gzip/Brotli) - Main Process 전용
 */
export class CompressUtil {
  public static async compress(data: string | Buffer, algo: 'gzip' | 'brotli'): Promise<Buffer> {
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf8');
    if (algo === 'gzip') return await gzip(buffer);
    return await brotliCompress(buffer);
  }

  public static async decompress(compressedData: Buffer, algo: 'gzip' | 'brotli'): Promise<string> {
    let decompressed: Buffer;
    if (algo === 'gzip') decompressed = await gunzip(compressedData);
    else decompressed = await brotliDecompress(compressedData);
    return decompressed.toString('utf8');
  }
}
