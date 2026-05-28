import { UdpViewModel } from './udp.viewmodel.js';

/**
 * UdpView (View)
 */
export class UdpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="send"></i> UDP Test</h3>
        <input type="number" id="udp-port" value="5001" placeholder="Port" />
        <button id="udp-bind-btn">Bind</button>
        <hr />
        <input type="text" id="udp-msg" placeholder="Message" />
        <input type="text" id="udp-addr" value="127.0.0.1" placeholder="Address" />
        <button id="udp-send-btn">Send</button>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get portInput() { return document.getElementById('udp-port') as HTMLInputElement; },
      get bindBtn() { return document.getElementById('udp-bind-btn'); },
      get msgInput() { return document.getElementById('udp-msg') as HTMLInputElement; },
      get addrInput() { return document.getElementById('udp-addr') as HTMLInputElement; },
      get sendBtn() { return document.getElementById('udp-send-btn'); }
    };
  }
}

/**
 * UdpBinder (Event Mapper)
 */
export class UdpBinder {
  constructor(
    private readonly view: UdpView,
    private readonly viewModel: UdpViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      
      if (target.id === 'udp-bind-btn') {
        const port = parseInt(this.view.elements.portInput.value);
        await this.viewModel.bind(port);
        alert(`UDP bound to ${port}`);
      }

      if (target.id === 'udp-send-btn') {
        const { msgInput, portInput, addrInput } = this.view.elements;
        await this.viewModel.send(msgInput.value, parseInt(portInput.value), addrInput.value);
      }
    });
  }
}
