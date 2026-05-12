import { Node, NodeStatus, Blackboard } from './base.js';

/**
 * 구체적인 행동을 수행하는 Leaf 노드의 기본 클래스입니다.
 */
export abstract class ActionNode extends Node {
  public abstract tick(blackboard: Blackboard): NodeStatus;
}
