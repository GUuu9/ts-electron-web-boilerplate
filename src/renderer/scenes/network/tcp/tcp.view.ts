import { TcpViewModel } from './tcp.viewmodel.js';
import tcpTemplate from './tcp.view.html?raw';

/**
 * TcpView (View)
 */
export class TcpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = tcpTemplate;
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
