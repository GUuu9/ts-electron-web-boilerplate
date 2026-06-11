import { ipcMain, type BrowserWindow, type FileFilter } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { FileServer } from './file.server.js';

/**
 * File Core 모듈
 * 렌더러 프로세스와의 IPC 통신을 중계하고 FileServer 기능을 노출합니다.
 */
export class FileCoreModule implements BackendModule {
  private readonly server: FileServer;

  constructor() {
    this.server = new FileServer();
  }

  /**
   * IPC 핸들러를 등록합니다.
   */
  public setupHandlers(_mainWindow: BrowserWindow | null): void {
    // 파일 읽기
    ipcMain.handle('file-read', (_, path: string, encoding?: BufferEncoding | null) => 
      this.server.readFile(path, encoding)
    );

    // 파일 쓰기
    ipcMain.handle('file-write', (_, path: string, content: string | Uint8Array, encoding?: BufferEncoding | null) => 
      this.server.writeFile(path, content, encoding)
    );

    // 파일 열기 다이얼로그
    ipcMain.handle('file-open-dialog', (_, filters?: FileFilter[]) => 
      this.server.showOpenDialog(filters)
    );

    // 파일 저장 다이얼로그
    ipcMain.handle('file-save-dialog', (_, filters?: FileFilter[], defaultPath?: string) => 
      this.server.showSaveDialog(filters, defaultPath)
    );
  }
}
