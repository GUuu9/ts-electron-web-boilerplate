import { SocketViewModel } from './socket.viewmodel.js';

/**
 * SocketView (View)
 */
export class SocketView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="zap"></i> Socket.io Test</h3>
        <input type="text" id="socket-url" value="http://localhost:3000" />
        <button id="connect-btn">Connect</button>
        <hr />
        <input type="text" id="msg-input" placeholder="Message" />
        <button id="send-btn">Send</button>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get socketUrl() { return document.getElementById('socket-url') as HTMLInputElement; },
      get connectBtn() { return document.getElementById('connect-btn'); },
      get msgInput() { return document.getElementById('msg-input') as HTMLInputElement; },
      get sendBtn() { return document.getElementById('send-btn'); }
    };
  }
}

/**
 * SocketBinder (Event Mapper)
 */
export class SocketBinder {
  constructor(
    private readonly view: SocketView,
    private readonly viewModel: SocketViewModel
  ) {}

  public bind() {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      
      if (target.id === 'connect-btn') {
        this.viewModel.connect(this.view.elements.socketUrl.value);
        alert('Socket connection attempt started...');
      }

      if (target.id === 'send-btn') {
        this.viewModel.sendMessage('chat', this.view.elements.msgInput.value);
      }
    });
  }
}
