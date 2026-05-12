import { Node, NodeStatus, Blackboard } from './base.js';

/**
 * Behavior Tree의 오케스트레이터입니다.
 */
export class BehaviorTree {
  private root: Node;
  private blackboard: Blackboard;

  constructor(root: Node, blackboard: Blackboard = new Blackboard()) {
    this.root = root;
    this.blackboard = blackboard;
  }

  public tick(): NodeStatus {
    return this.root.tick(this.blackboard);
  }

  public getBlackboard(): Blackboard {
    return this.blackboard;
  }
}
