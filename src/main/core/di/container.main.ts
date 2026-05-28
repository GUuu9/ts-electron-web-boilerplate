/**
 * MainDIContainer
 * 메인 프로세스(Backend) 전용 서비스 관리
 */
export class MainDIContainer {
  private static instance: MainDIContainer;
  private readonly services = new Map<string, any>();

  private constructor() {}

  public static getInstance(): MainDIContainer {
    if (!MainDIContainer.instance) MainDIContainer.instance = new MainDIContainer();
    return MainDIContainer.instance;
  }

  public register(key: string, service: any) {
    this.services.set(key, service);
  }

  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`[MainDI] ${key}가 등록되지 않았습니다.`);
    return service as T;
  }
}

export const container = MainDIContainer.getInstance();
