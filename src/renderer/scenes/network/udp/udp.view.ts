import { UdpViewModel } from './udp.viewmodel.js';

/**
 * UdpView (View)
 */
export class UdpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container udp-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="send"></i> UDP Communication</h3>
        </header>
        
        <section class="view-content" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <input type="number" id="udp-port" value="5001" placeholder="Port" style="width: 80px;" />
            <button id="udp-bind-btn" class="btn btn-outline">Bind Port</button>
            <button id="udp-close-btn" class="btn btn-danger">Close</button>
          </div>
          
          <div style="border-top: 1px solid var(--border); padding-top: 1rem;">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--text-dim);">Send Message</h4>
            <div style="display: flex; gap: 0.5rem;">
              <input type="text" id="udp-msg" placeholder="Message" style="flex: 1;" />
              <input type="text" id="udp-addr" value="127.0.0.1" placeholder="Address" style="width: 120px;" />
              <input type="number" id="udp-send-port" value="5001" placeholder="Port" style="width: 80px;" />
              <button id="udp-send-btn" class="btn btn-primary">Send</button>
            </div>
          </div>
          
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <h4 style="margin: 0; font-size: 0.9rem; color: var(--text-dim);">Log</h4>
            <div id="udp-log-area" style="height: 150px; overflow-y: auto; background: var(--input-bg); border: 1px solid var(--border); padding: 0.75rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text);"></div>
          </div>
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
        logArea.innerHTML += `<div style="margin-bottom: 0.2rem;">${msg}</div>`;
        logArea.scrollTop = logArea.scrollHeight;
      }
    });

    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const { portInput, msgInput, addrInput, sendPortInput } = this.view.elements;

      if (target.id === 'udp-bind-btn' || target.closest('#udp-bind-btn')) {
        await this.viewModel.bind(parseInt(portInput.value));
      }
      else if (target.id === 'udp-close-btn' || target.closest('#udp-close-btn')) {
        await this.viewModel.close();
      }
      else if (target.id === 'udp-send-btn' || target.closest('#udp-send-btn')) {
        await this.viewModel.send(msgInput.value, parseInt(sendPortInput.value), addrInput.value);
      }
    });
  }
}
