/**
 * RendererDIContainer
 * 렌더러 프로세스(Frontend) 전용 ViewModel/Service 관리
 */
export class RendererDIContainer {
  private static instance: RendererDIContainer;
  private readonly services = new Map<string, any>();

  private constructor() {}

  public static getInstance(): RendererDIContainer {
    if (!RendererDIContainer.instance) RendererDIContainer.instance = new RendererDIContainer();
    return RendererDIContainer.instance;
  }

  public register(key: string, service: any) {
    this.services.set(key, service);
  }

  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) throw new Error(`[RendererDI] ${key}가 등록되지 않았습니다.`);
    return service as T;
  }
}

export const container = RendererDIContainer.getInstance();
