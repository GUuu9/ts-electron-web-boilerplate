import { LLMModel, LLMGenerateResponse } from '../../../../shared/llm/models.js';

/**
 * LLM Repository: Electron Bridge를 통해 백엔드 LLM 서비스와 통신합니다.
 */
export class LLMRepository {
  /**
   * 로컬 LLM 모델 리스트를 가져옵니다.
   */
  public async getModels(): Promise<LLMModel[]> {
    if (!(window as any).electronAPI?.llm) return [];
    return await (window as any).electronAPI.llm.getModels();
  }

  /**
   * 텍스트 생성을 요청합니다.
   */
  public async generate(model: string, prompt: string, system?: string): Promise<LLMGenerateResponse> {
    if (!(window as any).electronAPI?.llm) {
      throw new Error('Electron API가 로드되지 않았습니다.');
    }
    return await (window as any).electronAPI.llm.generate(model, prompt, system);
  }

  /**
   * 새로운 모델을 다운로드합니다.
   */
  public async pullModel(modelName: string): Promise<void> {
    if (!(window as any).electronAPI?.llm) return;
    return await (window as any).electronAPI.llm.pullModel(modelName);
  }

  /**
   * 설치된 모델을 삭제합니다.
   */
  public async removeModel(modelName: string): Promise<void> {
    if (!(window as any).electronAPI?.llm) return;
    return await (window as any).electronAPI.llm.removeModel(modelName);
  }

  /**
   * 백엔드 llama-server의 모델을 교체합니다.
   */
  public async selectModel(modelName: string): Promise<{ success: boolean }> {
    if (!(window as any).electronAPI?.llm) return { success: false };
    return await (window as any).electronAPI.llm.selectModel(modelName);
  }

  /**
   * 현재 백엔드에서 활성화된 모델명을 조회합니다.
   */
  public async getActiveModel(): Promise<string | null> {
    if (!(window as any).electronAPI?.llm) return null;
    return await (window as any).electronAPI.llm.getActiveModel();
  }

  /**
   * 모델 다운로드 진행 상황을 구독합니다.
   */
  public onPullProgress(callback: (message: string) => void): () => void {
    if (!(window as any).electronAPI?.llm) return () => {};
    return (window as any).electronAPI.llm.onPullProgress(callback);
  }
}
