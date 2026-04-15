import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// ESM 환경에서는 __dirname이 존재하지 않으므로 직접 계산
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const preloadPath = path.join(__dirname, 'preload.js');
  console.log('Main Process Running. Preload Path:', preloadPath);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: preloadPath,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // preload가 process 객체에 접근할 수 있도록 일시적으로 false 설정 (테스트용)
    },
  });

  // 블루투스 장치 선택 이벤트 처리 (개발용 임시 자동 선택 예시)
  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault();
    if (deviceList.length > 0) {
      callback(deviceList[0].deviceId); // 첫 번째 장치를 자동으로 선택 (실제로는 UI를 띄워야 함)
    } else {
      callback(''); // 선택 취소
    }
  });

  // USB/HID 장치 접근 권한 자동 부여 (보안 정책에 따라 수정 가능)
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin) => {
    const p = permission as string;
    if (p === 'usb' || p === 'hid' || p === 'bluetooth') {
      return true;
    }
    return false;
  });

  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    const dt = details.deviceType as string;
    if (dt === 'usb' || dt === 'hid' || dt === 'bluetooth') {
      return true;
    }
    return false;
  });

  // 개발 환경에서는 Vite 개발 서버 주소를 로드하고,
  // 프로덕션 환경에서는 빌드된 index.html을 로드합니다.
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    // 개발자 도구 자동 열기 (선택 사항)
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
