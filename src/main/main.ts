import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { MainRegistry } from './core/di/registry.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.cjs');
  
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // 번들링된 CJS preload를 사용하므로 false 유지 또는 true 테스트 가능
    },
  });

  const rendererPath = path.join(__dirname, '../renderer/index.html');

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      mainWindow?.loadURL(pathToFileURL(rendererPath).toString());
    });
  } else {
    mainWindow.loadURL(pathToFileURL(rendererPath).toString());
  }
}

app.whenReady().then(() => {
  // 앱 준비 완료 후 모듈 초기화 및 창 생성
  createWindow();
  if (mainWindow) {
    MainRegistry.initBackend(mainWindow);
  }
});

app.on('will-quit', async (event) => {
  event.preventDefault(); // 종료 프로세스 유지
  await MainRegistry.shutdownAll();
  app.exit(0); // 강제 종료
});

// 터미널 Ctrl+C 처리
process.on('SIGINT', async () => {
  console.log('[System] SIGINT received, shutting down gracefully...');
  try {
    await MainRegistry.shutdownAll();
  } catch (err) {
    console.error('[System] Error during shutdown:', err);
  } finally {
    process.exit(0);
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
