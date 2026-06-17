import { LLMRepository } from '../../../data/ipc/llm/llm.repository.js';
import { LLMModel, LLMGenerateResponse } from '../../../../shared/llm/models.js';

/**
 * LLM Service: 비즈니스 로직 및 상태 관리를 담당하는 서비스
 */
export class LLMService {
  constructor(private repository: LLMRepository) {}

  /**
   * 사용 가능한 모델 목록을 반환합니다.
   */
  public async getAvailableModels(): Promise<LLMModel[]> {
    return await this.repository.getModels();
  }

  /**
   * 질문에 대한 응답을 생성합니다.
   */
  public async ask(model: string, prompt: string, system?: string): Promise<string> {
    const response: LLMGenerateResponse = await this.repository.generate(model, prompt, system);
    return response.text;
  }

  /**
   * 모델을 다운로드합니다.
   */
  public async pullModel(modelName: string): Promise<void> {
    await this.repository.pullModel(modelName);
  }

  /**
   * 모델을 삭제합니다.
   */
  public async removeModel(modelName: string): Promise<void> {
    await this.repository.removeModel(modelName);
  }

  /**
   * 사용할 로컬 모델을 백엔드에 선택/구동 요청합니다.
   */
  public async selectModel(modelName: string): Promise<boolean> {
    const res = await this.repository.selectModel(modelName);
    return res.success;
  }

  /**
   * 현재 가동 중인 모델명을 가져옵니다.
   */
  public async getActiveModel(): Promise<string | null> {
    return await this.repository.getActiveModel();
  }

  /**
   * 모델 다운로드 진행 상황을 구독합니다.
   */
  public onPullProgress(callback: (message: string) => void): () => void {
    return this.repository.onPullProgress(callback);
  }
}
