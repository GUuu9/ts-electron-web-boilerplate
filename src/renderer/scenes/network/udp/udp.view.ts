import { UdpViewModel } from './udp.viewmodel.js';

/**
 * UdpView (View)
 */
export class UdpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div id="udp-view">
        <section>
          <h3><i data-lucide="send"></i> UDP Test:Desktop</h3>
          <div class="input-group">
            <input type="number" id="udp-port" value="5001" placeholder="Port" />
            <button id="udp-bind-btn">Bind Port</button>
            <button id="udp-close-btn" style="background:#ff4d4f">Close</button>
          </div>
          <hr />
          <h4>Send Message</h4>
          <div class="input-group">
            <input type="text" id="udp-msg" placeholder="Message" />
            <input type="text" id="udp-addr" value="127.0.0.1" placeholder="Address" />
            <input type="number" id="udp-send-port" value="5001" placeholder="Port" />
            <button id="udp-send-btn">Send</button>
          </div>
        </section>
        <section>
          <h3>Log</h3>
          <div id="udp-log-area" style="height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; font-family: monospace; font-size: 12px; background: #555; color: #fff;"></div>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get portInput() { return document.getElementById('udp-port') as HTMLInputElement; },
      get bindBtn() { return document.getElementById('udp-bind-btn') as HTMLButtonElement; },
      get closeBtn() { return document.getElementById('udp-close-btn') as HTMLButtonElement; },
      get msgInput() { return document.getElementById('udp-msg') as HTMLInputElement; },
      get addrInput() { return document.getElementById('udp-addr') as HTMLInputElement; },
      get sendPortInput() { return document.getElementById('udp-send-port') as HTMLInputElement; },
      get sendBtn() { return document.getElementById('udp-send-btn') as HTMLButtonElement; },
      get logArea() { return document.getElementById('udp-log-area') as HTMLDivElement; }
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
    this.viewModel.setLogCallback((msg) => {
      const logArea = this.view.elements.logArea;
      if (logArea) {
        logArea.innerHTML += `<div>${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
      }
    });

    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const { portInput, msgInput, addrInput, sendPortInput } = this.view.elements;

      if (target.id === 'udp-bind-btn') {
        await this.viewModel.bind(parseInt(portInput.value));
      }
      else if (target.id === 'udp-close-btn') {
        await this.viewModel.close();
      }
      else if (target.id === 'udp-send-btn') {
        await this.viewModel.send(msgInput.value, parseInt(sendPortInput.value), addrInput.value);
      }
    });
  }
}
