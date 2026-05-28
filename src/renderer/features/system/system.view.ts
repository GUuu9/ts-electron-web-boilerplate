import { SystemViewModel } from './system.viewmodel.js';

/**
 * System View
 */
export class SystemView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="cpu"></i> System Information</h3>
        <button id="refresh-system-btn">Refresh Status</button>
        <div id="system-info-content" style="margin-top: 15px; font-family: monospace; white-space: pre-wrap; background: var(--bg); color: var(--text); padding: 10px; border-radius: 4px; border: 1px solid var(--border);">
          Click "Refresh Status" to load...
        </div>
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
      if (target.id === 'refresh-system-btn') {
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
