import * as fs from 'fs/promises';
import { dialog, type OpenDialogOptions, type SaveDialogOptions, type FileFilter } from 'electron';

/**
 * File Server (Backend Service)
 * 파일 시스템 접근 및 시스템 다이얼로그를 담당하는 서비스입니다.
 */
export class FileServer {
  /**
   * 파일을 읽습니다.
   * @param filePath 파일 경로
   * @param encoding 인코딩 (기본값 'utf-8', 바이너리의 경우 null 전달)
   * @returns 파일 내용 (문자열 또는 Buffer)
   */
  public async readFile(filePath: string, encoding: BufferEncoding | null = 'utf-8'): Promise<string | Buffer> {
    return await fs.readFile(filePath, { encoding: encoding as any });
  }

  /**
   * 파일을 저장합니다.
   * @param filePath 파일 경로
   * @param content 파일 내용
   * @param encoding 인코딩 (기본값 'utf-8')
   */
  public async writeFile(filePath: string, content: string | Uint8Array, encoding: BufferEncoding | null = 'utf-8'): Promise<void> {
    await fs.writeFile(filePath, content, { encoding: encoding as any });
  }

  /**
   * 디렉토리 내 파일 목록을 가져옵니다.
   */
  public async listFiles(dirPath: string): Promise<string[]> {
    return await fs.readdir(dirPath);
  }

  /**
   * 파일을 삭제합니다.
   */
  public async deleteFile(filePath: string): Promise<void> {
    await fs.unlink(filePath);
  }

  /**
   * 파일 열기 다이얼로그를 표시합니다.
   * @param filters 파일 필터 설정
   * @returns 선택된 파일 경로 또는 null
   */
  public async showOpenDialog(filters?: FileFilter[]): Promise<string | null> {
    const options: OpenDialogOptions = {
      properties: ['openFile'],
      filters: filters || [{ name: 'All Files', extensions: ['*'] }]
    };
    
    const { canceled, filePaths } = await dialog.showOpenDialog(options);
    return canceled ? null : filePaths[0];
  }

  /**
   * 파일 저장 다이얼로그를 표시합니다.
   * @param filters 파일 필터 설정
   * @param defaultPath 기본 저장 경로
   * @returns 설정된 파일 경로 또는 null
   */
  public async showSaveDialog(filters?: FileFilter[], defaultPath?: string): Promise<string | null> {
    const options: SaveDialogOptions = {
      title: 'Save File',
      defaultPath: defaultPath,
      filters: filters || [{ name: 'All Files', extensions: ['*'] }]
    };

    const { canceled, filePath } = await dialog.showSaveDialog(options);
    return canceled ? null : filePath || null;
  }
}
