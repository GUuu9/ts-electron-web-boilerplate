import { TcpViewModel } from './tcp.viewmodel.js';

/**
 * TcpView (View)
 */
export class TcpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container tcp-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="radio"></i> TCP Communication</h3>
        </header>

        <section class="view-content" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <!-- Server UI -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);">Server (Desktop)</h4>
              <div style="display: flex; gap: 0.5rem;">
                <input type="number" id="tcp-server-port" value="8888" style="width: 80px;" />
                <button id="tcp-toggle-server-btn" class="btn btn-outline" style="flex: 1;">Start Server</button>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="tcp-server-msg" placeholder="Message to broadcast" style="flex: 1;" />
                <button id="tcp-broadcast-btn" class="btn btn-primary">Broadcast</button>
              </div>
            </div>

            <!-- Client UI -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);">Client</h4>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="tcp-client-host" value="127.0.0.1" style="flex: 1;" />
                <input type="number" id="tcp-client-port" value="8888" style="width: 80px;" />
                <button id="tcp-toggle-client-btn" class="btn btn-outline">Connect</button>
              </div>
              <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="tcp-client-msg" placeholder="Message to server" style="flex: 1;" />
                <button id="tcp-client-send-btn" class="btn btn-primary">Send</button>
              </div>
            </div>
          </div>

          <!-- Log UI -->
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);">Log</h4>
            <div id="tcp-log-area" style="height: 150px; overflow-y: auto; background: var(--input-bg); border: 1px solid var(--border); padding: 0.75rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text);"></div>
          </div>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get serverPortInput() { return document.getElementById('tcp-server-port') as HTMLInputElement; },
      get toggleServerBtn() { return document.getElementById('tcp-toggle-server-btn') as HTMLButtonElement; },
      get serverMsgInput() { return document.getElementById('tcp-server-msg') as HTMLInputElement; },
      get broadcastBtn() { return document.getElementById('tcp-broadcast-btn') as HTMLButtonElement; },

      get clientHostInput() { return document.getElementById('tcp-client-host') as HTMLInputElement; },
      get clientPortInput() { return document.getElementById('tcp-client-port') as HTMLInputElement; },
      get toggleClientBtn() { return document.getElementById('tcp-toggle-client-btn') as HTMLButtonElement; },
      get clientMsgInput() { return document.getElementById('tcp-client-msg') as HTMLInputElement; },
      get clientSendBtn() { return document.getElementById('tcp-client-send-btn') as HTMLButtonElement; },

      get logArea() { return document.getElementById('tcp-log-area') as HTMLDivElement; },
    };
  }
}

/**
 * TcpBinder (Event Mapper)
 */
export class TcpBinder {
  constructor(
    private readonly view: TcpView,
    private readonly viewModel: TcpViewModel
  ) {}

  public bind() {
    // 1. 상태 변경 구독 (State -> View)
    this.viewModel.state.subscribe(() => {
      this.updateUI();
    });

    // 2. 로그 콜백 설정
    this.viewModel.setLogCallback((msg) => {
      const { logArea } = this.view.elements;
      if (logArea) {
        logArea.innerHTML += `<div style="margin-bottom: 0.2rem;">${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
      }
    });

    // 3. 이벤트 바인딩
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const {
        toggleServerBtn, serverPortInput, broadcastBtn, serverMsgInput,
        toggleClientBtn, clientHostInput, clientPortInput, clientSendBtn, clientMsgInput
      } = this.view.elements;

      if (target === toggleServerBtn || target.closest('#tcp-toggle-server-btn')) {
        await this.viewModel.toggleServer(parseInt(serverPortInput.value));
      }
      else if (target === broadcastBtn || target.closest('#tcp-broadcast-btn')) {
        await this.viewModel.serverBroadcast(serverMsgInput.value);
      }
      else if (target === toggleClientBtn || target.closest('#tcp-toggle-client-btn')) {
        await this.viewModel.toggleClient(clientHostInput.value, parseInt(clientPortInput.value));
      }
      else if (target === clientSendBtn || target.closest('#tcp-client-send-btn')) {
        await this.viewModel.clientSend(clientMsgInput.value);
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
