import { SerialViewModel } from './serial.viewmodel.js';
import serialTemplate from './serial.view.html?raw';

/**
 * Serial View
 */
export class SerialView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = serialTemplate;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get refreshBtn() { return document.getElementById('serial-refresh-btn'); },
      get portSelect() { return document.getElementById('serial-port-select') as HTMLSelectElement; },
      get baudSelect() { return document.getElementById('serial-baud-select') as HTMLSelectElement; },
      get connectBtn() { return document.getElementById('serial-connect-btn') as HTMLButtonElement; },
      get disconnectBtn() { return document.getElementById('serial-disconnect-btn') as HTMLButtonElement; },
      get txInput() { return document.getElementById('serial-tx-input') as HTMLInputElement; },
      get sendBtn() { return document.getElementById('serial-send-btn') as HTMLButtonElement; },
      get rxArea() { return document.getElementById('serial-rx-area'); }
    };
  }
}

/**
 * Serial Binder
 */
export class SerialBinder {
  private currentPath: string | null = null;

  constructor(
    private readonly view: SerialView,
    private readonly viewModel: SerialViewModel
  ) {}

  public bind() {
    // 데이터 수신 구독
    this.viewModel.subscribeData((data) => {
      const rxArea = this.view.elements.rxArea;
      if (rxArea) {
        const time = new Date().toLocaleTimeString();
        rxArea.innerHTML += `<div style="margin-bottom: 0.2rem;">[${time}] ${data.data}</div>`;
        rxArea.scrollTop = rxArea.scrollHeight;
      }
    });

    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const el = this.view.elements;

      // 포트 목록 새로고침
      if (target.id === 'serial-refresh-btn' || target.closest('#serial-refresh-btn')) {
        const ports = await this.viewModel.getPorts();
        if (el.portSelect) {
          el.portSelect.innerHTML = ports.map((p: any) => `<option value="${p.path}">${p.path} (${p.manufacturer || 'Unknown'})</option>`).join('');
        }
      }

      // 연결
      if (target.id === 'serial-connect-btn' || target.closest('#serial-connect-btn')) {
        const path = el.portSelect.value;
        const baud = parseInt(el.baudSelect.value);
        if (!path) return alert('Select a port first');

        const success = await this.viewModel.connect(path, baud);
        if (success) {
          this.currentPath = path;
          el.connectBtn.disabled = true;
          el.disconnectBtn.disabled = false;
          el.sendBtn.disabled = false;
          el.portSelect.disabled = true;
          alert('Connected to ' + path);
        } else {
          alert('Failed to connect');
        }
      }

      // 연결 해제
      if (target.id === 'serial-disconnect-btn' || target.closest('#serial-disconnect-btn')) {
        if (!this.currentPath) return;
        const success = await this.viewModel.disconnect(this.currentPath);
        if (success) {
          this.currentPath = null;
          el.connectBtn.disabled = false;
          el.disconnectBtn.disabled = true;
          el.sendBtn.disabled = true;
          el.portSelect.disabled = false;
          alert('Disconnected');
        }
      }

      // 데이터 전송
      if (target.id === 'serial-send-btn' || target.closest('#serial-send-btn')) {
        if (!this.currentPath || !el.txInput.value) return;
        await this.viewModel.send(this.currentPath, el.txInput.value);
        el.txInput.value = '';
      }
    });
  }
}
