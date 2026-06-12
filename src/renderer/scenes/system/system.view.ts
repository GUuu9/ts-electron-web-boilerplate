import { SystemViewModel } from './system.viewmodel.js';
import systemTemplate from './system.view.html?raw';

/**
 * System View
 */
export class SystemView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = systemTemplate;
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
