import { BaseState } from '../../data/operationData/base.state.js';
import { LLMModel, ChatMessage, LLMSessionMetadata } from '../../../shared/llm/models.js';

/**
 * LLMState
 * LLM 테스트 화면의 상태를 관리합니다.
 */
export class LLMState extends BaseState {
  private _models: LLMModel[] = [];
  private _selectedModel: string = '';
  private _messages: ChatMessage[] = [];
  private _isLoading: boolean = false;
  private _loadingMessage: string = '';
  private _systemPrompt: string = 'You are a helpful assistant.';
  private _agentStatus: string = '';
  private _isStreaming: boolean = false;
  private _currentStreamingMessage: string = '';
  private _serverStatus: 'starting' | 'ready' | 'stopped' = 'stopped';
  private _sessions: LLMSessionMetadata[] = [];
  private _currentSessionId: string | null = null;
  private _n_ctx: number = 2048; // 기본 컨텍스트 길이

  get models() { return this._models; }
  set models(value: LLMModel[]) {
    this._models = value;
    this.notify();
  }

  get selectedModel() { return this._selectedModel; }
  set selectedModel(value: string) {
    this._selectedModel = value;
    this.notify();
  }

  get messages() { return this._messages; }
  set messages(value: ChatMessage[]) {
    this._messages = value;
    this.notify();
  }

  get isLoading() { return this._isLoading; }
  set isLoading(value: boolean) {
    this._isLoading = value;
    this.notify();
  }

  get loadingMessage() { return this._loadingMessage; }
  set loadingMessage(value: string) {
    this._loadingMessage = value;
    this.notify();
  }

  get systemPrompt() { return this._systemPrompt; }
  set systemPrompt(value: string) {
    this._systemPrompt = value;
    this.notify();
  }

  get agentStatus() { return this._agentStatus; }
  set agentStatus(value: string) {
    this._agentStatus = value;
    this.notify();
  }

  get isStreaming() { return this._isStreaming; }
  set isStreaming(value: boolean) {
    this._isStreaming = value;
    this.notify();
  }

  get currentStreamingMessage() { return this._currentStreamingMessage; }
  set currentStreamingMessage(value: string) {
    this._currentStreamingMessage = value;
    this.notify();
  }

  get serverStatus() { return this._serverStatus; }
  set serverStatus(value: 'starting' | 'ready' | 'stopped') {
    this._serverStatus = value;
    this.notify();
  }

  get sessions() { return this._sessions; }
  set sessions(value: LLMSessionMetadata[]) {
    this._sessions = value;
    this.notify();
  }

  get currentSessionId() { return this._currentSessionId; }
  set currentSessionId(value: string | null) {
    this._currentSessionId = value;
    this.notify();
  }

  get n_ctx() { return this._n_ctx; }
  set n_ctx(value: number) {
    this._n_ctx = value;
    this.notify();
  }

  public appendStreamingChunk(chunk: string) {
    this._currentStreamingMessage += chunk;
    this.notify();
  }

  public finalizeStreamingMessage() {
    if (this._currentStreamingMessage) {
      this.addMessage({ role: 'assistant', content: this._currentStreamingMessage });
      this._currentStreamingMessage = '';
    }
    this._isStreaming = false;
    this.notify();
  }

  public addMessage(message: ChatMessage) {
    this._messages = [...this._messages, message];
    this.notify();
  }

  public clearMessages() {
    this._messages = [];
    this._currentStreamingMessage = '';
    this._isStreaming = false;
    this.notify();
  }
}
