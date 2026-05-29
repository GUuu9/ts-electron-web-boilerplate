import { SocketViewModel } from './socket.viewmodel.js';

/**
 * SocketView: UI 템플릿 및 요소 정의
 */
export class SocketView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="socket-view">
        <!-- Server UI -->
        <section>
          <h3>Socket Server</h3>
          <input type="number" id="server-port" value="3000" />
          <button id="toggle-server">Start Server</button>

          <h4>Broadcast</h4>
          <input type="text" id="server-event" placeholder="Event Name" value="message" />
          <input type="text" id="server-msg" placeholder="Message" />
          <button id="broadcast-btn">Broadcast</button>
        </section>

        <!-- Client UI -->
        <section>
          <h3>Socket Client</h3>
          <input type="text" id="client-url" value="http://localhost:3000" />
          <button id="connect-client">Connect</button>

          <h4>Send Message</h4>
          <input type="text" id="client-event" placeholder="Event Name" value="message" />
          <input type="text" id="client-msg" placeholder="Message" />
          <button id="send-msg-btn">Send Message</button>
        </section>

        <!-- Log UI -->
        <section>
          <h3>Log</h3>
          <div id="log-area" style="height: 150px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; font-family: monospace; font-size: 12px; background: #f9f9f9;"></div>
        </section>
      </div>
    `;
  }

  public get elements() {
    return {
      get toggleServerBtn() { return document.getElementById('toggle-server') as HTMLButtonElement; },
      get broadcastBtn() { return document.getElementById('broadcast-btn') as HTMLButtonElement; },
      get serverPortInput() { return document.getElementById('server-port') as HTMLInputElement; },
      get serverEventInput() { return document.getElementById('server-event') as HTMLInputElement; },
      get serverMsgInput() { return document.getElementById('server-msg') as HTMLInputElement; },
      
      get connectClientBtn() { return document.getElementById('connect-client') as HTMLButtonElement; },
      get sendMsgBtn() { return document.getElementById('send-msg-btn') as HTMLButtonElement; },
      get clientUrlInput() { return document.getElementById('client-url') as HTMLInputElement; },
      get clientEventInput() { return document.getElementById('client-event') as HTMLInputElement; },
      get clientMsgInput() { return document.getElementById('client-msg') as HTMLInputElement; },
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
    // 로그 콜백 설정
    this.viewModel.setLogCallback((msg) => {
      const logArea = this.view.elements.logArea;
      if (logArea) {
        logArea.innerHTML += `<div>${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
      }
    });

    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const { 
        toggleServerBtn, broadcastBtn, serverPortInput, serverEventInput, serverMsgInput,
        connectClientBtn, sendMsgBtn, clientUrlInput, clientEventInput, clientMsgInput
      } = this.view.elements;

      if (target === toggleServerBtn) {
        await this.viewModel.toggleServer(parseInt(serverPortInput.value));
        toggleServerBtn.innerText = this.viewModel.isServerRunning ? 'Stop Server' : 'Start Server';
        toggleServerBtn.style.backgroundColor = this.viewModel.isServerRunning ? '#ff4d4f' : '#52c41a';
      } else if (target === broadcastBtn) {
        await this.viewModel.broadcast(serverEventInput.value, serverMsgInput.value);
      } else if (target === connectClientBtn) {
        this.viewModel.connect(clientUrlInput.value);
      } else if (target === sendMsgBtn) {
        this.viewModel.sendMessage(clientEventInput.value, clientMsgInput.value);
      }
    });
  }
}
