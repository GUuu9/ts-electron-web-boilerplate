/**
 * 파일 필터 인터페이스
 */
export interface FileFilter {
  name: string;
  extensions: string[];
}

/**
 * File Repository
 * 렌더러 프로세스에서 파일 관련 데이터 접근을 담당합니다.
 */
export class FileRepository {
  /**
   * 파일을 읽습니다.
   * @param path 파일 경로
   * @param encoding 인코딩 (기본값 'utf-8', 바이너리의 경우 null)
   */
  public async read(path: string, encoding: string | null = 'utf-8'): Promise<any> {
    if (!(window as any).electronAPI?.file) return null;
    return await (window as any).electronAPI.file.read(path, encoding);
  }

  /**
   * 파일을 저장합니다.
   * @param path 파일 경로
   * @param content 파일 내용 (문자열 또는 Uint8Array)
   * @param encoding 인코딩 (기본값 'utf-8')
   */
  public async write(path: string, content: string | Uint8Array, encoding: string | null = 'utf-8'): Promise<void> {
    if (!(window as any).electronAPI?.file) return;
    await (window as any).electronAPI.file.write(path, content, encoding);
  }

  /**
   * 파일 열기 다이얼로그를 표시합니다.
   * @param filters 파일 필터
   */
  public async openDialog(filters?: FileFilter[]): Promise<string | null> {
    if (!(window as any).electronAPI?.file) return null;
    return await (window as any).electronAPI.file.openDialog(filters);
  }

  /**
   * 파일 저장 다이얼로그를 표시합니다.
   * @param filters 파일 필터
   * @param defaultPath 기본 경로
   */
  public async saveDialog(filters?: FileFilter[], defaultPath?: string): Promise<string | null> {
    if (!(window as any).electronAPI?.file) return null;
    return await (window as any).electronAPI.file.saveDialog(filters, defaultPath);
  }
}
