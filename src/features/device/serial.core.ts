import { ipcMain, type BrowserWindow } from 'electron';
import type { CoreFeature } from '../../core/core-feature.js';
import { container } from '../../core/di/container.main.js';
import type { SerialService } from './serial.service.js';

/**
 * Serial Core Feature
 * Node.js 기반 SerialPort 통신 기능을 Renderer에 제공합니다.
 */
export class SerialCoreFeature implements CoreFeature {
  id = 'serial';
  private serialService!: SerialService;
  private mainWindow: BrowserWindow | null = null;

  init() {
    this.serialService = container.get<SerialService>('SerialService');
  }

  onWindowCreated(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  setupHandlers() {
    // 포트 목록 조회
    ipcMain.handle('serial-list-ports', async () => {
      return await this.serialService.listPorts();
    });

    // 포트 열기
    ipcMain.handle('serial-open-port', async (_, path: string, baudRate: number) => {
      const success = await this.serialService.openPort(path, baudRate);
      if (success) {
        // 데이터 수신 시 렌더러로 전송
        this.serialService.onData(path, (data) => {
          console.log(`[Serial Main RX] ${path}: ${data.length} bytes`);
          this.mainWindow?.webContents.send(`serial-data-${path}`, data);
        });
      }
      return success;
    });

    // 포트 닫기
    ipcMain.handle('serial-close-port', async (_, path: string) => {
      return await this.serialService.closePort(path);
    });

    // 데이터 쓰기
    ipcMain.handle('serial-write', async (_, path: string, data: string) => {
      return await this.serialService.write(path, data);
    });
  }
}
