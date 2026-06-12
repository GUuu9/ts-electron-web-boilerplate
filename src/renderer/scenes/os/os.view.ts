import { OsViewModel } from './os.viewmodel.js';
import osTemplate from './os.view.html?raw';

/**
 * OsView (View)
 */
export class OsView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = osTemplate;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get titleInput() { return document.getElementById('os-title') as HTMLInputElement; },
      get bodyInput() { return document.getElementById('os-body') as HTMLTextAreaElement; },
      get notifyBtn() { return document.getElementById('notify-btn'); }
    };
  }
}

/**
 * OsBinder (Event Mapper)
 */
export class OsBinder {
  constructor(
    private readonly view: OsView,
    private readonly viewModel: OsViewModel
  ) {}

  public bind() {
    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      if (target.id === 'notify-btn' || target.closest('#notify-btn')) {
        const title = this.view.elements.titleInput.value || 'Default Title';
        const body = this.view.elements.bodyInput.value || 'Default Body.';
        await this.viewModel.sendNotification(title, body);
      }
    });
  }
}
