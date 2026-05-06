import * as Phaser from 'phaser';
import { Blackboard } from './ai/core/Blackboard.js';
import { Node } from './ai/core/Node.js';
import { Selector } from './ai/core/Selector.js';
import { Sequence } from './ai/core/Sequence.js';
import { DistanceCondition } from './ai/nodes/DistanceCondition.js';
import { FollowTargetAction } from './ai/nodes/FollowTargetAction.js';
import { WanderAction } from './ai/nodes/WanderAction.js';

/**
 * Behavior Tree가 탑재된 지능형 NPC 에이전트입니다.
 */
export class NpcAgent {
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private blackboard: Blackboard;
  private rootNode: Node;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, target: Phaser.GameObjects.GameObject) {
    // 1. 스프라이트 생성 및 설정
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.setTint(0xff0000); // 플레이어와 구분하기 위해 빨간색 틴트 적용
    this.sprite.setCollideWorldBounds(true);

    // 2. 블랙보드 초기화
    this.blackboard = new Blackboard();
    this.blackboard.set('agent', this.sprite);
    this.blackboard.set('target', target);

    // 3. 행동 트리 구축
    // 우선순위 1: 타겟이 가까우면 추격한다. (Sequence: DistanceCheck -> Follow)
    // 우선순위 2: 그렇지 않으면 배회한다. (Wander)
    this.rootNode = new Selector([
      new Sequence([
        new DistanceCondition(this.blackboard, 200), // 200px 이내 감지
        new FollowTargetAction(this.blackboard)
      ]),
      new WanderAction(this.blackboard)
    ]);
  }

  /**
   * 매 프레임마다 AI 로직을 업데이트합니다.
   */
  public update(): void {
    this.rootNode.tick();
    
    // 이동 방향에 따른 애니메이션 처리 (MainScene의 'dude' 애니메이션 재사용 가능)
    const velocity = this.sprite.body.velocity;
    if (velocity.x < 0) {
      this.sprite.anims.play('left', true);
    } else if (velocity.x > 0) {
      this.sprite.anims.play('right', true);
    } else {
      this.sprite.anims.play('turn');
    }
  }
}
