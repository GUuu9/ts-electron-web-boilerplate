import { Node, NodeStatus } from '../core/Node.js';
import { Blackboard } from '../core/Blackboard.js';
import * as Phaser from 'phaser';

/**
 * 무작위로 배회하는 행동 노드입니다.
 */
export class WanderAction extends Node {
  private targetPos: { x: number, y: number } | null = null;

  constructor(private blackboard: Blackboard) {
    super();
  }

  public tick(): NodeStatus {
    const agent = this.blackboard.get<Phaser.Types.Physics.Arcade.SpriteWithDynamicBody>('agent');
    if (!agent) return NodeStatus.FAILURE;

    // 새로운 목적지 설정 (목적지가 없거나 도착했을 때)
    if (!this.targetPos || Phaser.Math.Distance.Between(agent.x, agent.y, this.targetPos.x, this.targetPos.y) < 10) {
      this.targetPos = {
        x: Phaser.Math.Between(100, 700),
        y: Phaser.Math.Between(100, 500)
      };
    }

    // 목적지로 이동
    const angle = Phaser.Math.Angle.Between(agent.x, agent.y, this.targetPos.x, this.targetPos.y);
    agent.setVelocity(Math.cos(angle) * 80, Math.sin(angle) * 80);

    return NodeStatus.RUNNING;
  }
}
