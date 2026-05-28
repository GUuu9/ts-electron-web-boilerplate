/**
 * 행동 트리 노드의 실행 상태를 정의합니다.
 */
export enum NodeStatus {
  Success = 'Success', // 작업 성공
  Failure = 'Failure', // 작업 실패
  Running = 'Running', // 실행 중
}

/**
 * 트리의 노드들이 공유하는 공용 저장소입니다.
 * 시스템의 상태를 관리합니다.
 */
export class Blackboard {
  private data: Map<string, any> = new Map();

  // 특정 키의 값을 가져옵니다.
  get(key: string): any {
    return this.data.get(key);
  }

  // 특정 키의 값을 설정합니다.
  set(key: string, value: any): void {
    this.data.set(key, value);
  }

  // 특정 키가 존재하는지 확인합니다.
  has(key: string): boolean {
    return this.data.has(key);
  }
}

/**
 * 모든 행동 트리 노드가 상속받는 기본 클래스입니다.
 */
export abstract class BaseNode {
  abstract tick(blackboard: Blackboard): NodeStatus;
}

/**
 * 실제 기능(상태 제어, 데이터 변경 등)을 수행하는 말단 액션 노드입니다.
 */
export abstract class BaseAction extends BaseNode {
  abstract run(blackboard: Blackboard): NodeStatus;

  tick(blackboard: Blackboard): NodeStatus {
    return this.run(blackboard);
  }
}
