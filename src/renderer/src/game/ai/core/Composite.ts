import { Node } from './Node.js';

/**
 * 여러 자식 노드를 관리하는 복합 노드의 기반 클래스입니다.
 */
export abstract class Composite extends Node {
  protected children: Node[] = [];

  constructor(children: Node[] = []) {
    super();
    this.children = children;
  }

  public addChild(child: Node): void {
    this.children.push(child);
  }
}
