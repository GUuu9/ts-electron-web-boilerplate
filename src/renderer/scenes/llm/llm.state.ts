import { BaseState } from '../../data/operationData/base.state.js';
import { LLMModel } from '../../../shared/llm/models.js';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * LLMState
 * LLM 테스트 화면의 상태를 관리합니다.
 */
export class LLMState extends BaseState {
  private _models: LLMModel[] = [];
  private _selectedModel: string = '';
  private _messages: ChatMessage[] = [];
  private _isLoading: boolean = false;
  private _loadingMessage: string = 'AI가 생각 중입니다...';
  private _systemPrompt: string = 'You are a helpful assistant.';

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

  public addMessage(message: ChatMessage) {
    this._messages = [...this._messages, message];
    this.notify();
  }

  public clearMessages() {
    this._messages = [];
    this.notify();
  }
}
