import { Node, NodeStatus } from '../core/Node.js';
import { Blackboard } from '../core/Blackboard.js';
import * as Phaser from 'phaser';

/**
 * 타겟을 추격하는 행동 노드입니다.
 */
export class FollowTargetAction extends Node {
  constructor(private blackboard: Blackboard) {
    super();
  }

  public tick(): NodeStatus {
    const agent = this.blackboard.get<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>('agent');
    const target = this.blackboard.get<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>('target');

    if (!agent || !target) return NodeStatus.FAILURE;

    const angle = Phaser.Math.Angle.Between(agent.x, agent.y, target.x, target.y);
    agent.setVelocity(Math.cos(angle) * 120, Math.sin(angle) * 120);

    return NodeStatus.RUNNING;
  }
}
