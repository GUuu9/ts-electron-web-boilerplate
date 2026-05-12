/**
 * AI 시스템에서 공유 상태를 관리하는 Blackboard입니다.
 */
export class Blackboard {
  private data: Map<string, any> = new Map();

  public get(key: string): any {
    return this.data.get(key);
  }

  public set(key: string, value: any): void {
    this.data.set(key, value);
  }

  public toJSON(): Record<string, any> {
    return Object.fromEntries(this.data);
  }
}

/**
 * 노드 실행 상태입니다.
 */
export enum NodeStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  RUNNING = 'RUNNING',
}

/**
 * Behavior Tree의 추상 노드입니다.
 */
export abstract class Node {
  public abstract tick(blackboard: Blackboard): NodeStatus;
}

/**
 * 추상 Composite 노드입니다.
 */
export abstract class CompositeNode extends Node {
  protected children: Node[] = [];

  constructor(children: Node[] = []) {
    super();
    this.children = children;
  }
}
