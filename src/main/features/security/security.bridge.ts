import { ipcRenderer } from 'electron';

/**
 * Security Bridge
 */
export const securityBridge = {
  aesGenerate: () => ipcRenderer.invoke('test-aes-generate'),
  aesEncrypt: (text: string, keyHex: string) => ipcRenderer.invoke('test-aes-encrypt', text, keyHex),
  aesDecrypt: (enc: string, keyHex: string) => ipcRenderer.invoke('test-aes-decrypt', enc, keyHex),
  rsaGenerate: (keyLength: number) => ipcRenderer.invoke('test-rsa-generate', keyLength),
  rsaEncrypt: (text: string) => ipcRenderer.invoke('test-rsa-encrypt', text),
  rsaDecrypt: (base64: string) => ipcRenderer.invoke('test-rsa-decrypt', base64),
  compress: (text: string, algo: 'gzip' | 'brotli') => ipcRenderer.invoke('test-compress', text, algo),
  decompress: (base64: string, algo: 'gzip' | 'brotli') => ipcRenderer.invoke('test-decompress', base64, algo)
};
