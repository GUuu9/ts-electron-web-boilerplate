import { LoggerViewModel } from './logger.viewmodel.js';

/**
 * Logger View
 */
export class LoggerView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container logger-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="terminal"></i> System Logger</h3>
          <div class="view-actions">
            <button id="log-file-btn" class="btn btn-outline"><i data-lucide="folder-search"></i> Select Log File</button>
          </div>
        </header>
        
        <section class="view-content" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label>Current Log Path</label>
            <div id="log-path-display" style="background: var(--input-bg); border: 1px solid var(--border); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.85rem; color: var(--text-dim); min-height: 1.5rem;">
              No path selected
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem; border-top: 1px solid var(--border); padding-top: 1.5rem;">
            <div style="display: flex; gap: 1rem; align-items: flex-end;">
              <div style="display: flex; flex-direction: column; gap: 0.5rem; width: 120px;">
                <label>Level</label>
                <select id="log-level-select">
                  <option value="INFO">INFO</option>
                  <option value="ERROR">ERROR</option>
                  <option value="DEBUG">DEBUG</option>
                </select>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1;">
                <label>Message</label>
                <input type="text" id="log-msg-input" placeholder="Type a log message..." style="width: 100%;" />
              </div>
              
              <button id="log-send-btn" class="btn btn-primary" style="height: 42px;"><i data-lucide="send"></i> Log Message</button>
            </div>
          </div>
        </section>
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

      if (target.id === 'log-file-btn' || target.closest('#log-file-btn')) {
        const path = await this.viewModel.selectLogFile();
        if (path && el.pathDisplay) {
          el.pathDisplay.innerText = path;
        }
      }

      if (target.id === 'log-send-btn' || target.closest('#log-send-btn')) {
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
