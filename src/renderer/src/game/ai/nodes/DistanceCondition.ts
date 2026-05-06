import { Node, NodeStatus } from '../core/Node.js';
import { Blackboard } from '../core/Blackboard.js';
import * as Phaser from 'phaser';

/**
 * 타겟과의 거리를 체크하는 판단 노드입니다.
 */
export class DistanceCondition extends Node {
  constructor(
    private blackboard: Blackboard,
    private range: number
  ) {
    super();
  }

  public tick(): NodeStatus {
    const agent = this.blackboard.get<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>('agent');
    const target = this.blackboard.get<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>('target');

    if (!agent || !target) return NodeStatus.FAILURE;

    const distance = Phaser.Math.Distance.Between(agent.x, agent.y, target.x, target.y);
    
    return distance <= this.range ? NodeStatus.SUCCESS : NodeStatus.FAILURE;
  }
}
