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

    // 상태 구독
    this.viewModel.state.subscribe(() => {
      try {
        this.updateUI();
      } catch (e) {
        console.error('[LLMBinder] UI 업데이트 중 오류:', e);
      }
    });

    this.setupAutoResize();
    this.updateUI();
  }

  public unbind() {
    document.removeEventListener('click', this.boundClickHandler);
    document.removeEventListener('keydown', this.boundKeyDownHandler);
    document.removeEventListener('input', this.boundInputHandler);
    document.removeEventListener('change', this.boundChangeHandler);
    this.viewModel.destroy();
  }

  /**
   * 클릭 이벤트 처리
   */
  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const btn = target.closest('button');

    // 세션 항목 클릭 처리 (버튼이 아님)
    const sessionItem = target.closest('.session-item') as HTMLElement;
    if (sessionItem && !btn) {
      const sessionId = sessionItem.dataset.id;
      if (sessionId) this.viewModel.loadSession(sessionId);
      return;
    }

    if (!btn) return;

    // 각 버튼별 ID 기반 동작
    switch (btn.id) {
      case 'sidebar-toggle-btn':
      case 'close-sidebar-btn':
        this.toggleSidebar();
        break;
      case 'new-chat-btn':
        this.viewModel.createNewChat();
        break;
      case 'send-btn':
        this.handleSendMessage();
        break;
      case 'abort-btn':
        this.viewModel.abortGenerate();
        break;
      case 'reset-context-btn':
        this.viewModel.resetContext();
        break;
      case 'add-path-btn':
        const pathInput = document.getElementById('allowed-path-input') as HTMLInputElement;
        if (pathInput && pathInput.value.trim()) {
          this.viewModel.addAllowedPath(pathInput.value.trim());
          pathInput.value = '';
        }
        break;
      case 'refresh-chat-models-btn':
        this.viewModel.refreshModels();
        break;
      case 'pull-model-btn':
        const input = document.getElementById('pull-model-input') as HTMLInputElement;
        if (input && input.value.trim()) {
          this.viewModel.pullModel(input.value.trim());
          input.value = '';
        }
        break;
      case 'clear-chat-btn':
        this.viewModel.clearChat();
        break;
      case 'scroll-top-btn':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 'scroll-bottom-btn':
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        break;
    }

    // 세션 삭제 버튼
    if (btn.classList.contains('delete-session-btn')) {
      const id = btn.dataset.id;
      if (id) {
        event.stopPropagation();
        this.viewModel.deleteSession(id);
      }
    }

    // 모델 삭제 버튼
    if (btn.classList.contains('remove-model-item-btn')) {
      const modelName = btn.dataset.model;
      if (modelName) this.viewModel.removeModelSpecific(modelName);
    }
  }


  /**
   * 사이드바 토글 - 열기/닫기
   */
  private toggleSidebar() {
    const sidebar = document.getElementById('llm-sidebar');
    if (!sidebar) return;

    sidebar.classList.toggle('sidebar-open');
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
    if (target.id === 'context-length-input') {
      this.viewModel.setContextLength(parseInt((target as HTMLInputElement).value, 10));
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

    // 1. 로딩 인디케이터 및 버튼 상태
    const typingIndicator = document.getElementById('typing-indicator');
    const loaderMsg = document.getElementById('loader-message');
    const sendBtn = document.getElementById('send-btn') as HTMLButtonElement;
    const abortBtn = document.getElementById('abort-btn') as HTMLButtonElement;
    const agentStatusEl = document.getElementById('agent-status-bar');
    const statusBadge = document.getElementById('server-status-badge');
    const promptInput = document.getElementById('prompt-input') as HTMLTextAreaElement;
    const ctxInput = document.getElementById('context-length-input') as HTMLInputElement;

    const isDownloading = state.isLoading && (state.loadingMessage.includes('다운로드') || state.loadingMessage.includes('%'));
    const isGenerating = (state.isLoading || state.isStreaming) && !isDownloading;

    // 서버 상태 배지 업데이트
    if (statusBadge) {
      statusBadge.className = `status-indicator ${state.serverStatus}`;
    }

    // 입력창 placeholder 및 상태 제어
    if (promptInput) {
      if (state.serverStatus === 'starting') {
        promptInput.placeholder = 'AI 모델 구동 준비 중... 잠시만 기다려 주세요.';
        promptInput.disabled = true;
      } else if (state.serverStatus === 'ready') {
        promptInput.placeholder = '무엇이든 물어보세요...';
        promptInput.disabled = false;
      } else {
        promptInput.placeholder = '모델을 선택하여 구동해 주세요.';
        promptInput.disabled = true;
      }
    }

    if (ctxInput && document.activeElement !== ctxInput) {
      ctxInput.value = state.n_ctx.toString();
    }

    const downloadOverlay = document.getElementById('llm-loader');
    const downloadMsg = document.getElementById('download-loader-message');

    if (downloadOverlay) downloadOverlay.classList.toggle('hidden', !isDownloading);
    if (downloadMsg && isDownloading) downloadMsg.textContent = state.loadingMessage;

    if (typingIndicator) typingIndicator.classList.toggle('hidden', !isGenerating);
    if (loaderMsg && isGenerating) {
      loaderMsg.textContent = state.loadingMessage;
    }

    if (sendBtn) sendBtn.disabled = state.isLoading || state.isStreaming || state.serverStatus !== 'ready';
    if (abortBtn) abortBtn.classList.toggle('hidden', !(state.isLoading || state.isStreaming));

    if (agentStatusEl) {
      agentStatusEl.textContent = state.agentStatus;
      agentStatusEl.classList.toggle('hidden', !state.agentStatus);
    }

    // 2. 모델 셀렉트 업데이트 및 활성 모델 표시
    const modelSelect = document.getElementById('model-select-chat') as HTMLSelectElement;
    const activeModelDisplay = document.getElementById('active-model-name');
    
    if (activeModelDisplay) {
      activeModelDisplay.textContent = state.selectedModel || '모델을 선택하세요...';
    }

    if (modelSelect) {
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

    // 6. 세션 목록 렌더링
    const sessionListContainer = document.getElementById('chat-sessions-list');
    if (sessionListContainer) this.renderSessionList(sessionListContainer);
  }

  /**
   * 채팅 히스토리 렌더링
   */
  private renderChatHistory(container: HTMLElement) {
    const messages = [...this.viewModel.state.messages];
    
    // 스트리밍 중인 메시지가 있으면 임시로 추가하여 렌더링
    if (this.viewModel.state.isStreaming && this.viewModel.state.currentStreamingMessage) {
      messages.push({ role: 'assistant', content: this.viewModel.state.currentStreamingMessage });
    }

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="chat-welcome">
          <div class="welcome-icon"><i data-lucide="bot"></i></div>
          <h2>Local AI에 오신 것을 환영합니다</h2>
          <p>채팅을 시작하려면 메시지를 입력하거나 새 대화를 만드세요.</p>
        </div>`;
      (window as any).lucide?.createIcons();
      return;
    }

    container.innerHTML = '';
    messages.forEach(msg => {
      const row = document.createElement('div');
      row.className = `chat-row ${msg.role}`;

      const avatarClass = msg.role === 'user' ? 'user-av' : (msg.role === 'system' ? 'system-av' : 'ai');
      const icon = msg.role === 'user' ? 'user' : (msg.role === 'system' ? 'settings' : 'bot');

      row.innerHTML = `
        <div class="chat-avatar ${avatarClass}">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="chat-bubble">${this.escapeHtml(msg.content)}</div>`;

      container.appendChild(row);
    });

    (window as any).lucide?.createIcons();
    
    // DOM이 렌더링된 후 스크롤을 맨 아래로 이동
    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
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
          <span class="model-name" data-full-name="${this.escapeHtml(model.name)}">${isActive ? '▶ ' : ''}${this.escapeHtml(model.name)}</span>
          <span class="model-details">${sizeGB} GB | ${model.details?.quantization_level || 'GGUF'}</span>
        </div>
        <button class="remove-model-item-btn" data-model="${this.escapeHtml(model.name)}" title="Delete model">
          <i data-lucide="trash-2"></i>
        </button>`;
      container.appendChild(item);
    });

    (window as any).lucide?.createIcons();
  }

  /**
   * 세션 목록 렌더링
   */
  private renderSessionList(container: HTMLElement) {
    const sessions = this.viewModel.state.sessions;
    const currentId = this.viewModel.state.currentSessionId;

    if (sessions.length === 0) {
      container.innerHTML = '<div class="empty-list">최근 대화가 없습니다.</div>';
      return;
    }

    container.innerHTML = '';
    sessions.forEach(session => {
      const item = document.createElement('div');
      item.className = `session-item ${session.id === currentId ? 'active' : ''}`;
      item.dataset.id = session.id;

      item.innerHTML = `
        <div class="session-info">
          <span class="session-title">${this.escapeHtml(session.title)}</span>
          <span class="session-meta">${session.model}</span>
        </div>
        <button class="delete-session-btn" data-id="${session.id}" title="Delete chat">
          <i data-lucide="x"></i>
        </button>`;
      container.appendChild(item);
    });

    (window as any).lucide?.createIcons();
  }

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
