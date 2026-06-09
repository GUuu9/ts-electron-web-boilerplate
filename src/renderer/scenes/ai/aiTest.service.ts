import { AICore } from '../../core/ai/ai.core.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class AISceneService {
  constructor(
    private aiCore: AICore,
    private loggerService: LoggerService
  ) {}

  public async updateTargetPosition(targetPos: { x: number; y: number }): Promise<void> {
    await this.loggerService.log('INFO', `타겟 위치 업데이트: ${JSON.stringify(targetPos)}`);
    try {
      const tree = this.aiCore.getTree('shooter');
      if (tree) {
        tree.getBlackboard().set('targetPos', targetPos);
      }
    } catch (error) {
      await this.loggerService.log('ERROR', `타겟 위치 업데이트 실패: ${error}`);
      throw error;
    }
  }

  public async setThrowingState(isThrowing: boolean): Promise<void> {
    await this.loggerService.log('INFO', `던지기 상태 변경: ${isThrowing}`);
    try {
      const tree = this.aiCore.getTree('shooter');
      if (tree) {
        tree.getBlackboard().set('isThrowing', isThrowing);
      }
    } catch (error) {
      await this.loggerService.log('ERROR', `던지기 상태 변경 실패: ${error}`);
      throw error;
    }
  }

  public async updateAimBias(correction: number): Promise<void> {
    await this.loggerService.log('INFO', `조준 편향 조정: ${correction}`);
    try {
      const tree = this.aiCore.getTree('shooter');
      if (tree) {
        const bb = tree.getBlackboard();
        const currentBias = bb.get('aimBias') || 0;
        bb.set('aimBias', currentBias + correction);
        bb.set('isThrowing', false);
      }
    } catch (error) {
      await this.loggerService.log('ERROR', `조준 편향 조정 실패: ${error}`);
      throw error;
    }
  }

  public async recordMemory(dist: number, bias: number): Promise<void> {
      await this.loggerService.log('INFO', `AI 학습 데이터 저장: 거리=${dist}, Bias=${bias}`);
      // 메모리는 UI 상태이므로 ViewModel이 관리하는 것이 맞음. 
      // 서비스는 순수 데이터 접근 및 비즈니스 로직 처리.
  }
}
