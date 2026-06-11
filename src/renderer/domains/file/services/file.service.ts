import { FileRepository, type FileFilter } from '../../../data/ipc/file/file.repository.js';

/**
 * File Service
 * 도메인 수준에서의 파일 처리 비즈니스 로직을 담당합니다.
 */
export class FileService {
  constructor(private repository: FileRepository) {}

  /**
   * 파일을 읽습니다.
   * @param path 파일 경로
   * @param encoding 인코딩 (기본값 'utf-8', 바이너리의 경우 null)
   */
  public async read(path: string, encoding: string | null = 'utf-8'): Promise<any> {
    return await this.repository.read(path, encoding);
  }

  /**
   * 파일을 저장합니다.
   * @param path 파일 경로
   * @param content 파일 내용
   * @param encoding 인코딩 (기본값 'utf-8')
   */
  public async write(path: string, content: string | Uint8Array, encoding: string | null = 'utf-8'): Promise<void> {
    await this.repository.write(path, content, encoding);
  }

  /**
   * 파일 열기 다이얼로그를 표시합니다.
   * @param filters 파일 필터 (예: [{ name: 'Images', extensions: ['jpg', 'png'] }])
   */
  public async openDialog(filters?: FileFilter[]): Promise<string | null> {
    return await this.repository.openDialog(filters);
  }

  /**
   * 파일 저장 다이얼로그를 표시합니다.
   * @param filters 파일 필터
   * @param defaultPath 기본 파일명 또는 경로
   */
  public async saveDialog(filters?: FileFilter[], defaultPath?: string): Promise<string | null> {
    return await this.repository.saveDialog(filters, defaultPath);
  }
}
