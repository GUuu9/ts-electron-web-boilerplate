import type { BrowserWindow } from 'electron';

/**
 * CoreFeature 인터페이스
 * 메인 프로세스의 기능을 모듈화하기 위한 규격입니다.
 */
export interface CoreFeature {
  id: string; // 기능 고유 ID
  
  /**
   * IPC 핸들러를 등록합니다. (main.ts의 setupIpcHandlers 대체)
   */
  setupHandlers?: (mainWindow: BrowserWindow | null) => void;

  /**
   * Renderer에 노출할 API 정의를 반환합니다. (preload.ts의 contextBridge 대체)
   * key: 노출될 속성명, value: 노출될 함수나 객체
   */
  exposeApi?: () => Record<string, any>;

  /**
   * 앱 실행 시 필요한 초기화 로직 (창 생성 전 호출)
   */
  init?: () => void;

  /**
   * 메인 창 생성 후 필요한 로직 (이벤트 바인딩 등)
   */
  onWindowCreated?: (mainWindow: BrowserWindow) => void;
}
