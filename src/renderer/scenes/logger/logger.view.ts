import { LoggerViewModel } from './logger.viewmodel.js';

/**
 * Logger View
 */
export class LoggerView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="terminal"></i> System Logger</h3>
        <button id="log-file-btn">Select Log File Path</button>
        <p id="log-path-display" style="font-size: 0.8rem; color: var(--text-dim);"></p>
        
        <div style="margin-top: 15px;">
          <select id="log-level-select">
            <option value="INFO">INFO</option>
            <option value="ERROR">ERROR</option>
            <option value="DEBUG">DEBUG</option>
          </select>
          <input type="text" id="log-msg-input" placeholder="Type a log message..." style="width: 50%;" />
          <button id="log-send-btn">Log</button>
        </div>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get fileBtn() { return document.getElementById('log-file-btn'); },
      get pathDisplay() { return document.getElementById('log-path-display'); },
      get levelInput() { return document.getElementById('log-level-select') as HTMLSelectElement; },
      get msgInput() { return document.getElementById('log-msg-input') as HTMLInputElement; },
      get sendBtn() { return document.getElementById('log-send-btn'); }
    };
  }
}

/**
 * Logger Binder
 */
export class LoggerBinder {
  constructor(
    private readonly view: LoggerView,
    private readonly viewModel: LoggerViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const el = this.view.elements;

      if (target.id === 'log-file-btn') {
        const path = await this.viewModel.selectLogFile();
        if (path && el.pathDisplay) {
          el.pathDisplay.innerText = `Current Log Path: ${path}`;
        }
      }

      if (target.id === 'log-send-btn') {
        const msg = el.msgInput.value;
        const level = el.levelInput.value as 'INFO' | 'ERROR' | 'DEBUG';
        if (msg) {
          await this.viewModel.addLog(level, msg);
          el.msgInput.value = '';
          alert(`Logged as ${level} successfully`);
        }
      }
    });
  }
}
