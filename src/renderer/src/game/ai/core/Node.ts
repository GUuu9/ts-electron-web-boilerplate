/**
 * Behavior Tree 노드의 실행 상태를 정의합니다.
 */
export enum NodeStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING'
}

/**
 * 모든 AI 노드의 추상 기반 클래스입니다.
 */
export abstract class Node {
  /**
   * AI 로직의 한 단계를 실행합니다.
   * @returns NodeStatus - 실행 결과 상태
   */
  public abstract tick(): NodeStatus;
}
