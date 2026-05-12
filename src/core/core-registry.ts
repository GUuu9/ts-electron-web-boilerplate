import type { BrowserWindow } from 'electron';
import type { CoreFeature } from './core-feature.js';

/**
 * CoreRegistry
 * 메인 프로세스의 코어 기능 모듈들을 관리합니다.
 */
export class CoreRegistry {
  private static instance: CoreRegistry;
  private features: Map<string, CoreFeature> = new Map();

  private constructor() {}

  public static getInstance(): CoreRegistry {
    if (!CoreRegistry.instance) {
      CoreRegistry.instance = new CoreRegistry();
    }
    return CoreRegistry.instance;
  }

  /**
   * 코어 기능을 등록합니다.
   */
  public register(feature: CoreFeature): void {
    this.features.set(feature.id, feature);
  }

  /**
   * 등록된 모든 기능의 초기화 로직을 실행합니다.
   */
  public initAll(): void {
    this.features.forEach(f => f.init?.());
  }

  /**
   * 등록된 모든 기능의 IPC 핸들러를 설정합니다.
   */
  public setupAllHandlers(mainWindow: BrowserWindow | null): void {
    this.features.forEach(f => f.setupHandlers?.(mainWindow));
  }

  /**
   * 메인 창 생성 후 모든 기능의 후처리 로직을 실행합니다.
   */
  public onWindowCreatedAll(mainWindow: BrowserWindow): void {
    this.features.forEach(f => f.onWindowCreated?.(mainWindow));
  }

  /**
   * Preload에서 사용할 모든 API 정의를 수집합니다.
   */
  public getAllApis(): Record<string, any> {
    const combinedApi: Record<string, any> = {};
    this.features.forEach(f => {
      const api = f.exposeApi?.();
      if (api) {
        Object.assign(combinedApi, api);
      }
    });
    return combinedApi;
  }
}

export const coreRegistry = CoreRegistry.getInstance();
