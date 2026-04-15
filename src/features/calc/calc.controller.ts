import { CalcService } from '@/shared/calc.service.js';


/**
 * 계산과 관련된 입출력을 관리하는 컨트롤러
 * 계층 구조를 보여주기 위해 CalcService를 주입받아 사용합니다.
 */
export class CalcController {
  private readonly calcService: CalcService;

  /**
   * 생성자 주입 (Dependency Injection)
   * @param calcService 계산 서비스 인스턴스
   */
  constructor(calcService: CalcService) {
    this.calcService = calcService;
  }

  /**
   * 화면에서 전달받은 데이터를 처리합니다.
   * @param platform 현재 실행 플랫폼
   * @returns 처리 결과 메시지
   */
  public handleRequest(platform: string): string {
    const welcome = this.calcService.getWelcomeMessage(platform);
    const result = this.calcService.add(10, 20);
    return `${welcome}\n[결과: 10 + 20 = ${result}] (Controller에서 처리됨)`;
  }
}
