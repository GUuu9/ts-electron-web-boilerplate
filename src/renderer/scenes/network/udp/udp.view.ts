import { UdpViewModel } from './udp.viewmodel.js';
import udpTemplate from './udp.view.html?raw';

/**
 * UdpView (View)
 */
export class UdpView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = udpTemplate;
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
