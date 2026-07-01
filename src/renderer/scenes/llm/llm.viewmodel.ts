import { LLMState, ChatMessage } from './llm.state.js';
import { LLMSceneService } from './llmTest.service.js';

/**
 * LLM ViewModel
 */
export class LLMViewModel {
  public readonly state = new LLMState();
  private unsubs: (() => void)[] = [];
  private runningModelName: string | null = null;

  constructor(private readonly llmSceneService: LLMSceneService) {
    this.initialize();
    this.setupListeners();
  }

  private async initialize() {
    // 모델 목록 가져오기
    const models = await this.llmSceneService.fetchModels();
    this.state.models = models;
    
    // 활성 모델 설정
    const activeModel = await this.llmSceneService.getActiveModel();
    if (activeModel) {
      this.state.selectedModel = activeModel;
      this.state.serverStatus = 'ready';
      this.runningModelName = activeModel;
    } else if (models.length > 0) {
      this.state.selectedModel = models[0].name;
    }

    // 세션 목록 가져오기
    await this.refreshSessions();
  }

  private setupListeners() {
    // 서버 구동 상태 리스너: 로딩 바 자동 제어 및 상태 배지 업데이트
    this.unsubs.push(this.llmSceneService.subscribeServerStatus((status, modelName) => {
      this.state.serverStatus = status;
      
      if (status === 'starting') {
        this.state.isLoading = true;
        this.state.loadingMessage = `로컬 AI 모델 '${modelName}' 구동 준비 중...`;
      } else if (status === 'ready') {
        this.state.isLoading = false;
        this.state.loadingMessage = '';
        if (modelName) {
          this.state.selectedModel = modelName;
          this.runningModelName = modelName;
        }
      } else if (status === 'stopped') {
        this.state.isLoading = false;
        this.state.loadingMessage = '';
        this.runningModelName = null;
      }
    }));

    // 에이전트 작업 상태 리스너
    this.unsubs.push(this.llmSceneService.subscribeAgentStatus((status) => {
      this.state.agentStatus = status;
    }));

    // 스트리밍 데이터 리스너
    this.unsubs.push(this.llmSceneService.subscribeGenerateChunk((chunk) => {
      if (this.state.isStreaming) {
        this.state.appendStreamingChunk(chunk);
      }
    }));
  }

  public destroy() {
    this.unsubs.forEach(unsub => unsub());
    this.unsubs = [];
  }

  // --- 모델 관리 ---

  public async setSelectedModel(modelName: string) {
    if (this.runningModelName === modelName && this.state.serverStatus === 'ready') return;
    
    this.state.isLoading = true;
    this.state.loadingMessage = `로컬 AI 모델 '${modelName}' 구동 준비 중...`;
    
    try {
      // 선택된 컨텍스트 길이 적용
      const success = await this.llmSceneService.selectModel(modelName, this.state.n_ctx);
      if (success) {
        this.state.selectedModel = modelName;
      } else {
        alert(`모델 '${modelName}' 구동에 실패했습니다.`);
      }
    } finally {
      // ServerStatus 리스너에서 처리
    }
  }

  public setContextLength(value: number) {
    this.state.n_ctx = value;
  }

  // --- 세션 관리 ---

  public async refreshSessions() {
    const sessions = await this.llmSceneService.fetchSessions();
    this.state.sessions = sessions;
  }

  public async createNewChat() {
    if (!this.state.selectedModel) {
      alert('먼저 모델을 선택해주세요.');
      return;
    }
    this.state.isLoading = true;
    try {
      const session = await this.llmSceneService.createSession(this.state.selectedModel, this.state.systemPrompt);
      this.state.currentSessionId = session.id;
      this.state.messages = [];
      await this.refreshSessions();
    } finally {
      this.state.isLoading = false;
    }
  }

  public async loadSession(id: string) {
    if (this.state.currentSessionId === id) return;
    
    this.state.isLoading = true;
    try {
      const session = await this.llmSceneService.loadSession(id);
      if (session) {
        this.state.currentSessionId = session.id;
        this.state.messages = session.messages;
        this.state.selectedModel = session.model;
        this.state.systemPrompt = session.systemPrompt || this.state.systemPrompt;
        // 모델이 다르면 자동 전환 시도 (선택 사항)
      }
    } finally {
      this.state.isLoading = false;
    }
  }

  public async deleteSession(id: string) {
    if (!confirm('이 대화 내용을 삭제하시겠습니까?')) return;
    
    await this.llmSceneService.deleteSession(id);
    if (this.state.currentSessionId === id) {
      this.state.currentSessionId = null;
      this.state.messages = [];
    }
    await this.refreshSessions();
  }

  // --- 메시지 전송 ---

  public async sendMessage(content: string) {
    if (!content.trim() || this.state.isLoading) return;
    if (!this.state.selectedModel) {
      alert('모델을 선택해주세요.');
      return;
    }

    // 세션이 없으면 자동 생성
    if (!this.state.currentSessionId) {
      await this.createNewChat();
    }

    // UI 즉시 업데이트 (사용자 메시지)
    this.state.addMessage({ role: 'user', content });
    
    this.state.isLoading = true;
    this.state.isStreaming = true;
    this.state.currentStreamingMessage = '';
    this.state.agentStatus = 'AI가 생각 중입니다...';

    try {
      await this.llmSceneService.getResponse(
        this.state.selectedModel,
        content,
        this.state.systemPrompt
      );
      
      // 답변 완료 후 세션 목록 갱신 (제목 등 업데이트 대비)
      await this.refreshSessions();
    } catch (error: any) {
      console.error('[LLM VM] Message error:', error);
    } finally {
      this.state.finalizeStreamingMessage();
      this.state.isLoading = false;
      this.state.agentStatus = '';
    }
  }

  // --- 기타 기능 ---

  public setSystemPrompt(prompt: string) {
    this.state.systemPrompt = prompt;
  }

  public clearChat() {
    this.state.clearMessages();
  }

  public async resetContext() {
    await this.llmSceneService.resetContext();
    this.state.agentStatus = '대화 문맥이 초기화되었습니다.';
    setTimeout(() => { if (this.state.agentStatus.includes('초기화')) this.state.agentStatus = ''; }, 3000);
  }

  public async addAllowedPath(path: string) {
    if (!path.trim()) return;
    await this.llmSceneService.addAllowedPath(path);
    this.state.agentStatus = `경로 허용됨: ${path}`;
    setTimeout(() => { this.state.agentStatus = ''; }, 3000);
  }

  public async abortGenerate() {
    await this.llmSceneService.abort();
    if (this.state.isStreaming) {
      this.state.finalizeStreamingMessage();
    }
    this.state.isLoading = false;
    this.state.agentStatus = '사용자에 의해 중단됨';
    setTimeout(() => { if (this.state.agentStatus === '사용자에 의해 중단됨') this.state.agentStatus = ''; }, 3000);
  }

  public async refreshModels() {
    const models = await this.llmSceneService.fetchModels();
    this.state.models = models;
  }

  public async pullModel(modelName: string) {
    if (!modelName.trim() || this.state.isLoading) return;
    
    this.state.isLoading = true;
    this.state.loadingMessage = `모델 '${modelName}' 다운로드 준비 중...`;

    const unsub = this.llmSceneService.subscribePullProgress((message) => {
      this.state.loadingMessage = `[다운로드 중] ${message}`;
    });

    try {
      await this.llmSceneService.pullModel(modelName);
      await this.refreshModels();
      alert(`모델 '${modelName}' 다운로드가 완료되었습니다.`);
    } catch (error: any) {
      alert(`다운로드 실패: ${error.message}`);
    } finally {
      unsub();
      this.state.isLoading = false;
      this.state.loadingMessage = '';
    }
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
      this.state.loadingMessage = '';
    }
  }
}
