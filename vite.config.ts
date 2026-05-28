import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Electron 빌드 시 file:// 프로토콜 호환성을 위해 상대 경로('./')를 사용합니다.
  const base = './';

  return {
    root: path.resolve(__dirname, 'src/renderer'),
    base: base,
    publicDir: 'public',
    build: {
      outDir: path.resolve(__dirname, 'dist-electron/renderer'),
      emptyOutDir: true,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'src/renderer/index.html'),
        },
        output: {
          manualChunks: {
            phaser: ['phaser'],
          },
        },
      },
    },
    server: {
      port: 5173,
    },
  };
});
