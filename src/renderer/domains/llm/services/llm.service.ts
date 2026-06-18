import { LLMRepository } from '../../../data/ipc/llm/llm.repository.js';
import { LLMModel, LLMGenerateResponse, LLMSession, LLMSessionMetadata } from '../../../../shared/llm/models.js';

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
   * 생성을 중단합니다.
   */
  public async abort(): Promise<void> {
    await this.repository.abortGenerate();
  }

  /**
   * 컨텍스트를 초기화합니다.
   */
  public async resetContext(): Promise<void> {
    await this.repository.resetContext();
  }

  /**
   * 허용 경로를 추가합니다.
   */
  public async addAllowedPath(path: string): Promise<void> {
    await this.repository.addAllowedPath(path);
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
  public async selectModel(modelName: string, n_ctx?: number): Promise<boolean> {
    const res = await this.repository.selectModel(modelName, n_ctx);
    return res.success;
  }

  /**
   * 현재 가동 중인 모델명을 가져옵니다.
   */
  public async getActiveModel(): Promise<string | null> {
    return await this.repository.getActiveModel();
  }

  // --- 세션 관리 ---

  public async getSessions(): Promise<LLMSessionMetadata[]> {
    return await this.repository.getSessions();
  }

  public async createSession(model: string, systemPrompt?: string): Promise<LLMSession> {
    return await this.repository.createSession(model, systemPrompt);
  }

  public async loadSession(id: string): Promise<LLMSession | null> {
    return await this.repository.loadSession(id);
  }

  public async saveSession(session: LLMSession): Promise<void> {
    await this.repository.saveSession(session);
  }

  public async deleteSession(id: string): Promise<void> {
    await this.repository.deleteSession(id);
  }

  // --- 리스너 ---

  /**
   * 모델 다운로드 진행 상황을 구독합니다.
   */
  public onPullProgress(callback: (message: string) => void): () => void {
    return this.repository.onPullProgress(callback);
  }

  /**
   * 에이전트 상태를 구독합니다.
   */
  public onAgentStatus(callback: (status: string) => void): () => void {
    return this.repository.onAgentStatus(callback);
  }

  /**
   * 서버 상태를 구독합니다.
   */
  public onServerStatus(callback: (status: 'starting' | 'ready' | 'stopped', modelName?: string) => void): () => void {
    return this.repository.onServerStatus(callback);
  }

  /**
   * 생성 청크를 구독합니다.
   */
  public onGenerateChunk(callback: (chunk: string) => void): () => void {
    return this.repository.onGenerateChunk(callback);
  }
}
