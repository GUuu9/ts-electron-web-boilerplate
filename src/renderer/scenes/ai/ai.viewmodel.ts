import { AICore } from '../../core/ai/ai.core.js';
import { AISceneService } from './aiTest.service.js';

/**
 * AI ViewModel
 */
export class AIViewModel {
  constructor(
    private readonly aiCore: AICore,
    private readonly aiSceneService: AISceneService
  ) {}

  // AI가 경험을 저장하는 메모리 (거리 -> 최적의 bias)
  private memory: { distance: number, bias: number }[] = [];
  private isActive: boolean = false;

  public getStatus(): string {
    return 'AI Engine Running';
  }

  public setActive(active: boolean) {
    this.isActive = active;
  }

  public getIsActive(): boolean {
    return this.isActive;
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
          this.memory.push({ distance: dist, bias: bias });
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
      return { status: this.getStatus(), time: Date.now(), isViewActive: this.isActive };
    }
    
    const bb = tree.getBlackboard();
    // 메모리를 Blackboard에 주입하여 AI 액션이 참조할 수 있게 함
    bb.set('memory', this.memory);

    return {
      status: this.getStatus(),
      targetPos: bb.get('targetPos'),
      isThrowing: bb.get('isThrowing'),
      projectilePos: bb.get('projectilePos'),
      aimAngle: bb.get('aimAngle'),
      aimForce: bb.get('aimForce'),
      isViewActive: this.isActive,
      time: Date.now()
    };
  }
}
