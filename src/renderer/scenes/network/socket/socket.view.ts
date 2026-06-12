import { SocketViewModel } from './socket.viewmodel.js';
import socketTemplate from './socket.view.html?raw';

/**
 * SocketView: UI 템플릿 및 요소 정의
 */
export class SocketView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = socketTemplate;
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
