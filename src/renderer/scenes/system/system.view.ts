import { SystemViewModel } from './system.viewmodel.js';

/**
 * System View
 */
export class SystemView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container system-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="cpu"></i> System Information</h3>
          <div class="view-actions">
            <button id="refresh-system-btn" class="btn btn-primary"><i data-lucide="refresh-cw"></i> Refresh Status</button>
          </div>
        </header>
        
        <section class="view-content">
          <pre id="system-info-content" style="background: var(--input-bg); border: 1px solid var(--border); padding: 1rem; border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text); overflow-x: auto;">
            Click "Refresh Status" to load...
          </pre>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get refreshBtn() { return document.getElementById('refresh-system-btn'); },
      get contentArea() { return document.getElementById('system-info-content'); }
    };
  }
}

/**
 * System Binder
 */
export class SystemBinder {
  constructor(
    private readonly view: SystemView,
    private readonly viewModel: SystemViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      if (target.id === 'refresh-system-btn' || target.closest('#refresh-system-btn')) {
        const contentArea = this.view.elements.contentArea;
        if (contentArea) contentArea.innerText = 'Loading...';

        try {
          const status = await this.viewModel.getSystemStatus();
          if (contentArea) {
            contentArea.innerText = JSON.stringify(status, null, 2);
          }
        } catch (error) {
          if (contentArea) contentArea.innerText = 'Error loading system info';
        }
      }
    });
  }
}
