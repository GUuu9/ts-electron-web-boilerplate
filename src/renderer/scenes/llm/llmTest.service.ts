import { LLMService } from '../../domains/llm/services/llm.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';
import { LLMModel } from '../../../shared/llm/models.js';

/**
 * LLMSceneService
 * LLM 테스트 씬 전용 서비스
 */
export class LLMSceneService {
  constructor(
    private llmService: LLMService,
    private logger: LoggerService
  ) {}

  public async fetchModels(): Promise<LLMModel[]> {
    try {
      await this.logger.log('INFO', '[LLMScene] 모델 목록 요청 중...');
      const models = await this.llmService.getAvailableModels();
      await this.logger.log('INFO', `[LLMScene] ${models.length}개의 모델을 찾았습니다.`);
      return models;
    } catch (error) {
      await this.logger.log('ERROR', `[LLMScene] 모델 목록 요청 실패: ${error}`);
      return [];
    }
  }

  public async getResponse(model: string, prompt: string, system?: string): Promise<string> {
    try {
      await this.logger.log('INFO', `[LLMScene] [${model}] 질문: ${prompt}`);
      const response = await this.llmService.ask(model, prompt, system);
      await this.logger.log('INFO', `[LLMScene] [${model}] 응답 수신 완료`);
      return response;
    } catch (error: any) {
      await this.logger.log('ERROR', `[LLMScene] [${model}] 응답 요청 실패: ${error}`);
      return `오류 발생: ${error.message}`;
    }
  }

  public async pullModel(modelName: string): Promise<void> {
    try {
      await this.logger.log('INFO', `[LLMScene] 모델 다운로드 시작: ${modelName}`);
      await this.llmService.pullModel(modelName);
      await this.logger.log('INFO', `[LLMScene] 모델 다운로드 완료: ${modelName}`);
    } catch (error) {
      await this.logger.log('ERROR', `[LLMScene] 모델 다운로드 실패 (${modelName}): ${error}`);
      throw error;
    }
  }

  public async removeModel(modelName: string): Promise<void> {
    try {
      await this.logger.log('INFO', `[LLMScene] 모델 삭제 시작: ${modelName}`);
      await this.llmService.removeModel(modelName);
      await this.logger.log('INFO', `[LLMScene] 모델 삭제 완료: ${modelName}`);
    } catch (error) {
      await this.logger.log('ERROR', `[LLMScene] 모델 삭제 실패 (${modelName}): ${error}`);
      throw error;
    }
  }

  public async selectModel(modelName: string): Promise<boolean> {
    try {
      await this.logger.log('INFO', `[LLMScene] 모델 변경 요청: ${modelName}`);
      const success = await this.llmService.selectModel(modelName);
      if (success) {
        await this.logger.log('INFO', `[LLMScene] 모델 변경 완료: ${modelName}`);
      } else {
        await this.logger.log('ERROR', `[LLMScene] 모델 변경 실패: ${modelName}`);
      }
      return success;
    } catch (error) {
      await this.logger.log('ERROR', `[LLMScene] 모델 변경 중 에러 발생 (${modelName}): ${error}`);
      return false;
    }
  }

  public async getActiveModel(): Promise<string | null> {
    try {
      return await this.llmService.getActiveModel();
    } catch (error) {
      await this.logger.log('ERROR', `[LLMScene] 활성 모델 조회 실패: ${error}`);
      return null;
    }
  }

  public subscribePullProgress(callback: (message: string) => void): () => void {
    return this.llmService.onPullProgress(callback);
  }
}
