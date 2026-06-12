import { SocketViewModel } from './socket.viewmodel.js';

/**
 * SocketView: UI 템플릿 및 요소 정의
 */
export class SocketView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container socket-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="zap"></i> Socket Communication</h3>
        </header>

        <section class="view-content" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <!-- Server UI -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);">Server (Desktop)</h4>
              <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="server-port" value="3000" style="width: 80px;" />
                <button id="toggle-server" class="btn btn-outline" style="flex: 1;">Start Server</button>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="server-listen-event" placeholder="Event to Listen" value="chat" style="flex: 1;" />
                <button id="server-listen-btn" class="btn btn-outline">Listen</button>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="server-event" placeholder="Event" value="message" style="width: 80px;" />
                <input type="text" id="server-msg" placeholder="Message" style="flex: 1;" />
                <button id="broadcast-btn" class="btn btn-primary">Broadcast</button>
              </div>
            </div>

            <!-- Client UI -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);">Client</h4>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="client-url" value="http://localhost:3000" style="flex: 1;" />
                <button id="toggle-client" class="btn btn-outline">Connect</button>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="client-listen-event" placeholder="Event to Listen" value="message" style="flex: 1;" />
                <button id="client-listen-btn" class="btn btn-outline">Listen</button>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="client-event" placeholder="Event" value="message" style="width: 80px;" />
                <input type="text" id="client-msg" placeholder="Message" style="flex: 1;" />
                <button id="send-msg-btn" class="btn btn-primary">Send</button>
              </div>
            </div>
          </div>

          <!-- Log UI -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);">Log</h4>
            <div id="log-area" style="height: 150px; overflow-y: auto; background: var(--input-bg); border: 1px solid var(--border); padding: 0.75rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text);"></div>
          </div>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get toggleServerBtn() { return document.getElementById('toggle-server') as HTMLButtonElement; },
      get broadcastBtn() { return document.getElementById('broadcast-btn') as HTMLButtonElement; },
      get serverListenBtn() { return document.getElementById('server-listen-btn') as HTMLButtonElement; },
      get serverPortInput() { return document.getElementById('server-port') as HTMLInputElement; },
      get serverEventInput() { return document.getElementById('server-event') as HTMLInputElement; },
      get serverMsgInput() { return document.getElementById('server-msg') as HTMLInputElement; },
      get serverListenEventInput() { return document.getElementById('server-listen-event') as HTMLInputElement; },
      
      get toggleClientBtn() { return document.getElementById('toggle-client') as HTMLButtonElement; },
      get sendMsgBtn() { return document.getElementById('send-msg-btn') as HTMLButtonElement; },
      get clientListenBtn() { return document.getElementById('client-listen-btn') as HTMLButtonElement; },
      get clientUrlInput() { return document.getElementById('client-url') as HTMLInputElement; },
      get clientEventInput() { return document.getElementById('client-event') as HTMLInputElement; },
      get clientMsgInput() { return document.getElementById('client-msg') as HTMLInputElement; },
      get clientListenEventInput() { return document.getElementById('client-listen-event') as HTMLInputElement; },
      get logArea() { return document.getElementById('log-area') as HTMLDivElement; },
    };
  }
}

/**
 * SocketBinder: View와 ViewModel 연결
 */
export class SocketBinder {
  constructor(
    private readonly view: SocketView,
    private readonly viewModel: SocketViewModel
  ) {}

  public bind(): void {
    // 1. 상태 변경 구독 (State -> View)
    this.viewModel.state.subscribe(() => {
      this.updateUI();
    });

    // 2. 로그 콜백 설정
    this.viewModel.setLogCallback((msg) => {
      const logArea = this.view.elements.logArea;
      if (logArea) {
        logArea.innerHTML += `<div>${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
      }
    });

    // 3. 이벤트 바인딩
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const { 
        toggleServerBtn, broadcastBtn, serverListenBtn, serverPortInput, serverEventInput, serverMsgInput, serverListenEventInput,
        toggleClientBtn, sendMsgBtn, clientListenBtn, clientUrlInput, clientEventInput, clientMsgInput, clientListenEventInput
      } = this.view.elements;

      if (target === toggleServerBtn || target.closest('#toggle-server')) {
        await this.viewModel.toggleServer(parseInt(serverPortInput.value));
      } 
      else if (target === broadcastBtn || target.closest('#broadcast-btn')) {
        await this.viewModel.broadcast(serverEventInput.value, serverMsgInput.value);
      } 
      else if (target === serverListenBtn || target.closest('#server-listen-btn')) {
        await this.viewModel.subscribeServerEvent(serverListenEventInput.value);
      }
      else if (target === toggleClientBtn || target.closest('#toggle-client')) {
        await this.viewModel.toggleClient(clientUrlInput.value);
      } 
      else if (target === sendMsgBtn || target.closest('#send-msg-btn')) {
        this.viewModel.sendMessage(clientEventInput.value, clientMsgInput.value);
      }
      else if (target === clientListenBtn || target.closest('#client-listen-btn')) {
        this.viewModel.subscribeClientEvent(clientListenEventInput.value);
      }
    });

    // 초기 UI 업데이트
    this.updateUI();
  }

  private updateUI() {
    const { toggleServerBtn, toggleClientBtn } = this.view.elements;
    
    if (toggleServerBtn) {
      const isRunning = this.viewModel.isServerRunning;
      toggleServerBtn.innerText = isRunning ? 'Stop Server' : 'Start Server';
      toggleServerBtn.className = isRunning ? 'btn btn-danger' : 'btn btn-outline';
    }

    if (toggleClientBtn) {
      const isConnected = this.viewModel.isClientConnected;
      toggleClientBtn.innerText = isConnected ? 'Disconnect' : 'Connect';
      toggleClientBtn.className = isConnected ? 'btn btn-danger' : 'btn btn-outline';
    }
  }
}
