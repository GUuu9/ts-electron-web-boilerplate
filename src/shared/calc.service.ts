/**
 * 계산 관련 비즈니스 로직을 담당하는 서비스 클래스
 */
export class CalcService {
  /**
   * 두 숫자의 합을 계산합니다.
   * @param a 첫 번째 숫자
   * @param b 두 번째 숫자
   */
  public add(a: number, b: number): number {
    return a + b;
  }

  /**
   * 환영 메시지를 생성합니다.
   */
  public getWelcomeMessage(platform: string): string {
    return `${platform} 환경에서 DI를 통해 호출된 CalcService입니다!`;
  }
}
