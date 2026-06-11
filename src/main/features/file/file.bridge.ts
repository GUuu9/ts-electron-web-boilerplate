import { ipcRenderer, type FileFilter } from 'electron';

/**
 * File Bridge
 * 렌더러 프로세스에서 메인 프로세스의 파일 기능을 호출하기 위한 브릿지 객체입니다.
 */
export const fileBridge = {
  /** 파일을 읽습니다. */
  read: (path: string, encoding?: BufferEncoding | null) => 
    ipcRenderer.invoke('file-read', path, encoding),

  /** 파일을 저장합니다. */
  write: (path: string, content: string | Uint8Array, encoding?: BufferEncoding | null) => 
    ipcRenderer.invoke('file-write', path, content, encoding),

  /** 파일 열기 다이얼로그를 표시합니다. */
  openDialog: (filters?: FileFilter[]) => 
    ipcRenderer.invoke('file-open-dialog', filters),

  /** 파일 저장 다이얼로그를 표시합니다. */
  saveDialog: (filters?: FileFilter[], defaultPath?: string) => 
    ipcRenderer.invoke('file-save-dialog', filters, defaultPath)
};
