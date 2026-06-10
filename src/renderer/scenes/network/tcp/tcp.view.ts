import { TcpViewModel } from './tcp.viewmodel.js';

/**
 * TcpView (View)
 */
export class TcpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="tcp-view">
        <!-- Server UI -->
        <section>
          <h3>TCP Server:Desktop</h3>
          <div class="input-group">
            <input type="number" id="tcp-server-port" value="8888" />
            <button id="tcp-toggle-server-btn">Start Server</button>
          </div>

          <h4>Broadcast</h4>
          <div class="input-group">
            <input type="text" id="tcp-server-msg" placeholder="Message to broadcast" />
            <button id="tcp-broadcast-btn">Broadcast</button>
          </div>
        </section>

        <!-- Client UI -->
        <section>
          <h3>TCP Client:Desktop</h3>
          <div class="input-group">
            <input type="text" id="tcp-client-host" value="127.0.0.1" />
            <input type="number" id="tcp-client-port" value="8888" />
            <button id="tcp-toggle-client-btn">Connect</button>
          </div>

          <h4>Send Message</h4>
          <div class="input-group">
            <input type="text" id="tcp-client-msg" placeholder="Message to server" />
            <button id="tcp-client-send-btn">Send</button>
          </div>
        </section>

        <!-- Log UI -->
        <section>
          <h3>Log</h3>
          <div id="tcp-log-area" style="height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; font-family: monospace; font-size: 12px; background: #555; color: #fff;"></div>
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
        logArea.innerHTML += `<div>${msg}</div>`;
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

      if (target === toggleServerBtn) {
        await this.viewModel.toggleServer(parseInt(serverPortInput.value));
      }
      else if (target === broadcastBtn) {
        await this.viewModel.serverBroadcast(serverMsgInput.value);
      }
      else if (target === toggleClientBtn) {
        await this.viewModel.toggleClient(clientHostInput.value, parseInt(clientPortInput.value));
      }
      else if (target === clientSendBtn) {
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
      toggleServerBtn.style.backgroundColor = isRunning ? '#ff4d4f' : '#4f46e5';
    }

    if (toggleClientBtn) {
      const isConnected = this.viewModel.isClientConnected;
      toggleClientBtn.innerText = isConnected ? 'Disconnect' : 'Connect';
      toggleClientBtn.style.backgroundColor = isConnected ? '#ff4d4f' : '#4f46e5';
    }
  }
}
