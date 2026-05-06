import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  base: '/ts-electron-web-boilerplate/',
  // process.env 전체를 덮어쓰지 않고, 필요한 값만 정의하거나 비워둡니다.
  // 이렇게 해야 Electron의 실제 process 객체가 렌더러에서 유지됩니다.
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/renderer/index.html'),
        logger: path.resolve(__dirname, 'src/renderer/logger.html'),
      },
      external: ['net', 'dgram', 'path', 'fs', 'url'],
    },
  },
});
