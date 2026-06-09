/**
 * BaseState
 * 모든 상태 관리 클래스의 기반이 되는 클래스입니다.
 * 구독(Subscribe) 및 알림(Notify) 로직을 공통으로 관리합니다.
 */
export abstract class BaseState {
  protected listeners: (() => void)[] = [];

  /**
   * 상태 변경 시 호출될 콜백 함수를 등록합니다.
   * 구독을 취소할 수 있는 함수를 반환합니다.
   */
  public subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * 현재 상태가 변경되었음을 모든 구독자에게 알립니다.
   */
  public notify() {
    this.listeners.forEach(l => l());
  }
}
