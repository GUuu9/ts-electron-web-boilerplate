import { LLMState, ChatMessage } from './llm.state.js';
import { LLMSceneService } from './llmTest.service.js';

/**
 * LLM ViewModel
 */
export class LLMViewModel {
  public readonly state = new LLMState();
  private unsubscribeProgress: (() => void) | null = null;

  constructor(private readonly llmSceneService: LLMSceneService) {
    this.initialize();
  }

  private async initialize() {
    const models = await this.llmSceneService.fetchModels();
    this.state.models = models;
    
    // 백엔드에서 활성화된 모델 가져와 설정
    const activeModel = await this.llmSceneService.getActiveModel();
    if (activeModel) {
      this.state.selectedModel = activeModel;
    } else if (models.length > 0) {
      this.state.selectedModel = models[0].name;
    }
  }

  public destroy() {
    if (this.unsubscribeProgress) {
      this.unsubscribeProgress();
    }
  }

  public async setSelectedModel(modelName: string) {
    if (this.state.selectedModel === modelName) return;
    
    this.state.isLoading = true;
    this.state.loadingMessage = `로컬 AI 모델 '${modelName}' 구동 준비 중...`;
    
    try {
      const success = await this.llmSceneService.selectModel(modelName);
      if (success) {
        this.state.selectedModel = modelName;
      } else {
        alert(`모델 '${modelName}' 구동에 실패했습니다.\n\n가능한 원인:\n• 모델 로딩 시간 초과 (30초 이내 포트 바인딩 실패)\n• bin/ 폴더에 llama-server 바이너리 미설치\n• 터미널 로그를 확인해 주세요.`);
      }
    } finally {
      this.state.isLoading = false;
      this.state.loadingMessage = 'AI가 생각 중입니다...';
    }
  }

  public setSystemPrompt(prompt: string) {
    this.state.systemPrompt = prompt;
  }

  public clearChat() {
    this.state.clearMessages();
  }

  public async sendMessage(content: string) {
    if (!content.trim() || this.state.isLoading) return;
    if (!this.state.selectedModel) {
      alert('모델을 선택해주세요.');
      return;
    }

    // 사용자 메시지 추가
    const userMsg: ChatMessage = { role: 'user', content };
    this.state.addMessage(userMsg);
    this.state.isLoading = true;
    this.state.loadingMessage = 'AI가 생각 중입니다...';

    try {
      // LLM 응답 요청
      const responseText = await this.llmSceneService.getResponse(
        this.state.selectedModel,
        content,
        this.state.systemPrompt
      );

      // AI 메시지 추가
      const aiMsg: ChatMessage = { role: 'assistant', content: responseText };
      this.state.addMessage(aiMsg);
    } finally {
      this.state.isLoading = false;
    }
  }

  public async refreshModels() {
    const models = await this.llmSceneService.fetchModels();
    this.state.models = models;
    const activeModel = await this.llmSceneService.getActiveModel();
    if (activeModel) {
      this.state.selectedModel = activeModel;
    } else if (!this.state.selectedModel && models.length > 0) {
      this.state.selectedModel = models[0].name;
    }
  }

  public async pullModel(modelName: string) {
    if (!modelName.trim() || this.state.isLoading) return;
    
    this.state.isLoading = true;
    this.state.loadingMessage = `모델 '${modelName}' 다운로드 준비 중...`;

    // 진행 상황 구독
    this.unsubscribeProgress = this.llmSceneService.subscribePullProgress((message) => {
      this.state.loadingMessage = `[다운로드 중] ${message}`;
    });

    try {
      await this.llmSceneService.pullModel(modelName);
      await this.refreshModels();
      alert(`모델 '${modelName}' 다운로드가 완료되었습니다.`);
    } catch (error: any) {
      alert(`다운로드 실패: ${error.message}`);
    } finally {
      if (this.unsubscribeProgress) {
        this.unsubscribeProgress();
        this.unsubscribeProgress = null;
      }
      this.state.isLoading = false;
      this.state.loadingMessage = 'AI가 생각 중입니다...'; // 기본값 복구
    }
  }

  public async removeModel() {
    const modelName = this.state.selectedModel;
    if (!modelName) return;
    await this.removeModelSpecific(modelName);
  }

  public async removeModelSpecific(modelName: string) {
    if (!modelName || this.state.isLoading) return;

    if (!confirm(`정말로 모델 '${modelName}'을(를) 삭제하시겠습니까?`)) return;

    this.state.isLoading = true;
    this.state.loadingMessage = `모델 '${modelName}' 삭제 중...`;

    try {
      await this.llmSceneService.removeModel(modelName);
      if (this.state.selectedModel === modelName) {
        this.state.selectedModel = '';
      }
      await this.refreshModels();
      alert(`모델 '${modelName}'이(가) 삭제되었습니다.`);
    } catch (error: any) {
      alert(`삭제 실패: ${error.message}`);
    } finally {
      this.state.isLoading = false;
      this.state.loadingMessage = 'AI가 생각 중입니다...';
    }
  }
}
