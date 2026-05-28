import { BehaviorTree } from '../../../shared/core/ai/tree.js';
import { createExampleTree } from './trees/example.tree.js';
import { createShooterTree } from './trees/shooter.tree.js';

/**
 * 렌더러의 행동 트리 엔진을 관리하는 핵심 클래스입니다.
 */
export class AICore {
  private trees: Map<string, BehaviorTree> = new Map();

  constructor() {
    this.registerTree('example', createExampleTree());
    this.registerTree('shooter', createShooterTree());
  }

  // 행동 트리를 등록합니다.
  registerTree(name: string, tree: BehaviorTree): void {
    this.trees.set(name, tree);
  }

  getTree(name: string): BehaviorTree | undefined {
    return this.trees.get(name);
  }

  // 모든 등록된 행동 트리를 한 단계 실행합니다.
  tickAll(): void {
    for (const tree of this.trees.values()) {
      tree.tick();
    }
  }
}
