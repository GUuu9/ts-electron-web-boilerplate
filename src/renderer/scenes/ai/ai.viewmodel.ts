import { AICore } from '../../core/ai/ai.core.js';
import { AISceneService } from './aiTest.service.js';
import { AIState } from './ai.state.js';

/**
 * AI ViewModel
 */
export class AIViewModel {
  public readonly state = new AIState();

  constructor(
    private readonly aiCore: AICore,
    private readonly aiSceneService: AISceneService
  ) {}

  public getStatus(): string {
    return 'AI Engine Running';
  }

  public setActive(active: boolean) {
    this.state.isActive = active;
  }

  public getIsActive(): boolean {
    return this.state.isActive;
  }

  public async respawnTarget() {
    try {
      await this.aiSceneService.updateTargetPosition({ 
        x: 600 + Math.random() * 100, 
        y: 100 + Math.random() * 400 
      });
    } catch (error) {
      console.error('AIViewModel respawnTarget 오류:', error);
    }
  }

  public async resetThrowing() {
    try {
      await this.aiSceneService.setThrowingState(false);
    } catch (error) {
      console.error('AIViewModel resetThrowing 오류:', error);
    }
  }

  public async missTarget() {
    try {
      const correction = (Math.random() - 0.5) * 0.2;
      await this.aiSceneService.updateAimBias(correction);
    } catch (error) {
      console.error('AIViewModel missTarget 오류:', error);
    }
  }
  
  public async hitTarget() {
    try {
      const tree = this.aiCore.getTree('shooter');
      if (tree) {
        const bb = tree.getBlackboard();
        const dist = bb.get('lastDistance');
        const bias = bb.get('aimBias');
        
        if (dist !== undefined && bias !== undefined) {
          const newMemory = [...this.state.memory, { distance: dist, bias: bias }];
          this.state.memory = newMemory;
          await this.aiSceneService.recordMemory(dist, bias);
        }
        
        await this.aiSceneService.setThrowingState(false);
      }
    } catch (error) {
      console.error('AIViewModel hitTarget 오류:', error);
    }
  }

  // Phaser가 렌더링할 데이터를 가공하여 반환
  public getRenderData() {
    const tree = this.aiCore.getTree('shooter');
    if (!tree) {
      return { status: this.getStatus(), time: Date.now(), isViewActive: this.state.isActive };
    }
    
    const bb = tree.getBlackboard();
    // 메모리를 Blackboard에 주입하여 AI 액션이 참조할 수 있게 함
    bb.set('memory', this.state.memory);

    return {
      status: this.getStatus(),
      targetPos: bb.get('targetPos'),
      isThrowing: bb.get('isThrowing'),
      projectilePos: bb.get('projectilePos'),
      aimAngle: bb.get('aimAngle'),
      aimForce: bb.get('aimForce'),
      isViewActive: this.state.isActive,
      time: Date.now()
    };
  }
}
