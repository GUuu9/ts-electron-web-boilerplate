import { LLMService } from '../../domains/llm/services/llm.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';
import { LLMModel, LLMSession, LLMSessionMetadata } from '../../../shared/llm/models.js';

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

  public async abort(): Promise<void> {
    await this.llmService.abort();
  }

  public async resetContext(): Promise<void> {
    await this.llmService.resetContext();
  }

  public async addAllowedPath(path: string): Promise<void> {
    await this.llmService.addAllowedPath(path);
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

  public async selectModel(modelName: string, n_ctx?: number): Promise<boolean> {
    try {
      await this.logger.log('INFO', `[LLMScene] 모델 변경 요청: ${modelName} (ctx: ${n_ctx})`);
      const success = await this.llmService.selectModel(modelName, n_ctx);
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

  // --- 세션 관련 ---

  public async fetchSessions(): Promise<LLMSessionMetadata[]> {
    return await this.llmService.getSessions();
  }

  public async createSession(model: string, systemPrompt?: string): Promise<LLMSession> {
    return await this.llmService.createSession(model, systemPrompt);
  }

  public async loadSession(id: string): Promise<LLMSession | null> {
    return await this.llmService.loadSession(id);
  }

  public async saveSession(session: LLMSession): Promise<void> {
    await this.llmService.saveSession(session);
  }

  public async deleteSession(id: string): Promise<void> {
    await this.llmService.deleteSession(id);
  }

  // --- 리스너 ---

  public subscribePullProgress(callback: (message: string) => void): () => void {
    return this.llmService.onPullProgress(callback);
  }

  public subscribeAgentStatus(callback: (status: string) => void): () => void {
    return this.llmService.onAgentStatus(callback);
  }

  public subscribeServerStatus(callback: (status: 'starting' | 'ready' | 'stopped', modelName?: string) => void): () => void {
    return this.llmService.onServerStatus(callback);
  }

  public subscribeGenerateChunk(callback: (chunk: string) => void): () => void {
    return this.llmService.onGenerateChunk(callback);
  }
}
