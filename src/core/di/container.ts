import { CalcService } from '../../shared/calc.service';
import { CalcController } from '../../features/calc/calc.controller';

/**
 * 간단한 의존성 주입(DI) 컨테이너 클래스
 */
export class DIContainer {
  private static instance: DIContainer;
  private readonly services = new Map<string, any>();

  private constructor() {
    // 1. 서비스 등록
    const calcService = new CalcService();
    this.services.set('CalcService', calcService);

    // 2. 컨트롤러 등록 (서비스 주입)
    const calcController = new CalcController(calcService);
    this.services.set('CalcController', calcController);
  }

  /**
   * 싱글톤 인스턴스를 가져옵니다.
   */
  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  /**
   * 등록된 서비스나 컨트롤러를 가져옵니다.
   */
  public get<T>(key: string): T {
    const service = this.services.get(key);
    if (!service) {
      throw new Error(`${key}가 컨테이너에 등록되지 않았습니다.`);
    }
    return service as T;
  }
}

// 편리한 접근을 위해 인스턴스 바로 노출
export const container = DIContainer.getInstance();
