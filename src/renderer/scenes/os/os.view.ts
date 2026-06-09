import { OsViewModel } from './os.viewmodel.js';

/**
 * OsView (View)
 */
export class OsView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="monitor"></i> OS Integration Test</h3>
        <div style="margin-bottom: 10px;">
          <input type="text" id="os-title" placeholder="알림 제목" style="width: 100%; margin-bottom: 5px;" />
          <textarea id="os-body" placeholder="알림 내용" style="width: 100%; height: 60px;"></textarea>
        </div>
        <button id="notify-btn">Send Notification</button>
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
      if (target.id === 'notify-btn') {
        const title = this.view.elements.titleInput.value || '기본 제목';
        const body = this.view.elements.bodyInput.value || '기본 내용입니다.';
        await this.viewModel.sendNotification(title, body);
      }
    });
  }
}
