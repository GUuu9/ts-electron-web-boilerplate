import { LLMViewModel } from './llm.viewmodel.js';
import viewHtml from './llm.view.html?raw';

/**
 * LLM View
 */
export class LLMView {
  public viewModel!: LLMViewModel;

  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = viewHtml;
    (window as any).lucide?.createIcons();
  }
}

/**
 * LLM Binder - GPT 스타일 UI 이벤트 바인딩
 */
export class LLMBinder {
  private boundClickHandler: (event: MouseEvent) => void;
  private boundKeyDownHandler: (event: KeyboardEvent) => void;
  private boundInputHandler: (event: Event) => void;
  private boundChangeHandler: (event: Event) => void;

  constructor(private view: LLMView, private viewModel: LLMViewModel) {
    this.boundClickHandler = this.handleClick.bind(this);
    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
    this.boundInputHandler = this.handleInput.bind(this);
    this.boundChangeHandler = this.handleChange.bind(this);
  }

  public bind() {
    this.view.viewModel = this.viewModel;

    // 이벤트 리스너 등록
    document.addEventListener('click', this.boundClickHandler);
    document.addEventListener('keydown', this.boundKeyDownHandler);
    document.addEventListener('input', this.boundInputHandler);
    document.addEventListener('change', this.boundChangeHandler);

    // 상태 구독 - 상태 변경 시 UI 갱신
    this.viewModel.state.subscribe(() => {
      try {
        this.updateUI();
      } catch (e) {
        console.error('[LLMBinder] UI 업데이트 중 오류:', e);
      }
    });

    // textarea 자동 높이 조절
    this.setupAutoResize();

    // 초기 UI 반영
    this.updateUI();
  }

  public unbind() {
    document.removeEventListener('click', this.boundClickHandler);
    document.removeEventListener('keydown', this.boundKeyDownHandler);
    document.removeEventListener('input', this.boundInputHandler);
    document.removeEventListener('change', this.boundChangeHandler);
  }

  /**
   * 클릭 이벤트 처리
   */
  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // 사이드바 토글 버튼
    if (target.id === 'sidebar-toggle-btn' || target.closest('#sidebar-toggle-btn')) {
      this.toggleSidebar();
      return;
    }

    // 전송 버튼
    if (target.id === 'send-btn' || target.closest('#send-btn')) {
      this.handleSendMessage();
      return;
    }

    // 모델 새로고침 버튼
    if (target.id === 'refresh-chat-models-btn' || target.closest('#refresh-chat-models-btn')) {
      this.viewModel.refreshModels();
      return;
    }

    // 모델 다운로드 버튼
    if (target.id === 'pull-model-btn' || target.closest('#pull-model-btn')) {
      const input = document.getElementById('pull-model-input') as HTMLInputElement;
      if (input && input.value.trim()) {
        this.viewModel.pullModel(input.value.trim());
        input.value = '';
      }
      return;
    }

    // 모델 삭제 버튼
    if (target.classList.contains('remove-model-item-btn') || target.closest('.remove-model-item-btn')) {
      const btn = target.closest('.remove-model-item-btn') as HTMLElement || target;
      const modelName = btn.dataset.model;
      if (modelName) {
        this.viewModel.removeModelSpecific(modelName);
      }
      return;
    }

    // 대화 초기화 버튼
    if (target.id === 'clear-chat-btn' || target.closest('#clear-chat-btn')) {
      this.viewModel.clearChat();
      return;
    }
  }

  /**
   * 사이드바 토글 - 웴기/닫기
   */
  private toggleSidebar() {
    const sidebar = document.getElementById('llm-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (!sidebar) return;

    const isOpen = sidebar.classList.toggle('sidebar-open');
    toggleBtn?.classList.toggle('active', isOpen);
  }

  /**
   * 키보드 이벤트 처리 - Enter 전송, Shift+Enter 줄바꿈
   */
  private handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.id === 'prompt-input' && event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.handleSendMessage();
    }
  }

  /**
   * input 이벤트 처리 - System Prompt 업데이트 및 textarea 자동 높이
   */
  private handleInput(event: Event) {
    const target = event.target as HTMLElement;
    if (target.id === 'system-prompt') {
      this.viewModel.setSystemPrompt((target as HTMLTextAreaElement).value);
    }
    if (target.id === 'prompt-input') {
      this.autoResizeTextarea(target as HTMLTextAreaElement);
    }
  }

  /**
   * change 이벤트 처리 - 모델 선택 변경 시 백엔드 재구동
   */
  private handleChange(event: Event) {
    const target = event.target as HTMLElement;
    if (target.id === 'model-select-chat') {
      const selected = (target as HTMLSelectElement).value;
      if (selected) this.viewModel.setSelectedModel(selected);
    }
  }

  /**
   * 메시지 전송 처리
   */
  private handleSendMessage() {
    const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
    if (!promptInput) return;

    const text = promptInput.value.trim();
    if (text) {
      this.viewModel.sendMessage(text);
      promptInput.value = '';
      this.autoResizeTextarea(promptInput);
    }
  }

  /**
   * textarea 자동 높이 조절 설정
   */
  private setupAutoResize() {
    const textarea = document.getElementById('prompt-input') as HTMLTextAreaElement;
    if (textarea) this.autoResizeTextarea(textarea);
  }

  private autoResizeTextarea(el: HTMLTextAreaElement) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }

  /**
   * 전체 UI 갱신
   */
  private updateUI() {
    const state = this.viewModel.state;

    // 1. 로딩 인디케이터 (타이핑 인디케이터)
    const typingIndicator = document.getElementById('typing-indicator');
    const loaderMsg = document.getElementById('loader-message');
    const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;

    // 다운로드 중인 경우 오버레이 표시, 채팅 로딩인 경우 타이핑 인디케이터 표시
    const isDownloading = state.isLoading && state.loadingMessage.includes('%');
    const isGenerating = state.isLoading && !isDownloading;

    const downloadOverlay = document.getElementById('llm-loader');
    const downloadMsg = document.getElementById('download-loader-message');

    if (downloadOverlay) downloadOverlay.classList.toggle('hidden', !isDownloading);
    if (downloadMsg && isDownloading) downloadMsg.textContent = state.loadingMessage;

    if (typingIndicator) typingIndicator.classList.toggle('hidden', !isGenerating);
    if (loaderMsg && isGenerating) loaderMsg.textContent = state.loadingMessage;

    if (sendBtn) sendBtn.disabled = state.isLoading;

    // 2. 모델 셀렉트 업데이트
    const modelSelect = document.getElementById('model-select-chat') as HTMLSelectElement;
    if (modelSelect) {
      // 모델 수가 달라졌을 때만 옵션 재생성
      if (modelSelect.options.length - 1 !== state.models.length) {
        modelSelect.innerHTML = '<option value="">모델을 선택하세요...</option>';
        state.models.forEach(model => {
          const option = document.createElement('option');
          option.value = model.name;
          option.textContent = model.name;
          if (model.name === state.selectedModel) option.selected = true;
          modelSelect.appendChild(option);
        });
      } else {
        modelSelect.value = state.selectedModel;
      }
    }

    // 3. System Prompt
    const systemPromptEl = document.getElementById('system-prompt') as HTMLTextAreaElement;
    if (systemPromptEl && document.activeElement !== systemPromptEl) {
      systemPromptEl.value = state.systemPrompt;
    }

    // 4. 채팅 히스토리 렌더링
    const chatHistory = document.getElementById('chat-history');
    if (chatHistory) this.renderChatHistory(chatHistory);

    // 5. 설치된 모델 목록 렌더링
    const modelListContainer = document.getElementById('installed-models-list');
    if (modelListContainer) this.renderModelList(modelListContainer);
  }

  /**
   * 채팅 히스토리 렌더링 - GPT 스타일 말풍선
   */
  private renderChatHistory(container: HTMLElement) {
    const messages = this.viewModel.state.messages;

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="chat-welcome">
          <div class="welcome-icon"><i data-lucide="bot"></i></div>
          <h2>Local AI에 오신 것을 환영합니다</h2>
          <p>좌측에서 모델을 선택한 뒤 대화를 시작하세요.</p>
        </div>`;
      (window as any).lucide?.createIcons();
      return;
    }

    container.innerHTML = '';
    messages.forEach(msg => {
      const row = document.createElement('div');
      row.className = `chat-row ${msg.role}`;

      if (msg.role === 'user') {
        row.innerHTML = `
          <div class="chat-avatar user-av"><i data-lucide="user"></i></div>
          <div class="chat-bubble">${this.escapeHtml(msg.content)}</div>`;
      } else if (msg.role === 'assistant') {
        row.innerHTML = `
          <div class="chat-avatar ai"><i data-lucide="bot"></i></div>
          <div class="chat-bubble">${this.escapeHtml(msg.content)}</div>`;
      }

      container.appendChild(row);
    });

    (window as any).lucide?.createIcons();
    // 최신 메시지로 자동 스크롤
    container.scrollTop = container.scrollHeight;
  }

  /**
   * 설치된 모델 목록 렌더링
   */
  private renderModelList(container: HTMLElement) {
    const models = this.viewModel.state.models;
    if (models.length === 0) {
      container.innerHTML = '<div class="empty-list">설치된 모델이 없습니다.</div>';
      return;
    }

    container.innerHTML = '';
    models.forEach(model => {
      const item = document.createElement('div');
      item.className = 'model-item';

      const sizeGB = (model.size / (1024 * 1024 * 1024)).toFixed(2);
      const isActive = model.name === this.viewModel.state.selectedModel;

      item.innerHTML = `
        <div class="model-info">
          <span class="model-name">${isActive ? '▶ ' : ''}${this.escapeHtml(model.name)}</span>
          <span class="model-details">${sizeGB} GB | ${model.details?.quantization_level || 'GGUF'}</span>
        </div>
        <button class="remove-model-item-btn" data-model="${this.escapeHtml(model.name)}" title="삭제">
          <i data-lucide="trash-2"></i>
        </button>`;
      container.appendChild(item);
    });

    (window as any).lucide?.createIcons();
  }

  /**
   * XSS 방지를 위한 HTML 이스케이프
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\n/g, '<br>');
  }
}
