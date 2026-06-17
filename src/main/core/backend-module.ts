import type { BrowserWindow } from 'electron';

/**
 * BackendModule
 * 모든 백엔드 기능 모듈이 구현해야 할 공통 인터페이스
 */
export interface BackendModule {
  setupHandlers(mainWindow: BrowserWindow | null): void;
  init?(): void;
  shutdown?(): void;
}
