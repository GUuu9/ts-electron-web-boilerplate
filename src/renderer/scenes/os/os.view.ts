import { OsViewModel } from './os.viewmodel.js';

/**
 * OsView (View)
 */
export class OsView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container os-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="monitor"></i> OS Integration Test</h3>
        </header>
        <section class="view-content" style="display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label>Title</label>
            <input type="text" id="os-title" placeholder="Notification title" />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label>Body</label>
            <textarea id="os-body" placeholder="Notification body" style="height: 100px;"></textarea>
          </div>
          <button id="notify-btn" class="btn btn-primary"><i data-lucide="bell"></i> Send Notification</button>
        </section>
      </div>
    `;
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
