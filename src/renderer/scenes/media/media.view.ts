import { MediaViewModel } from './media.viewmodel.js';
import mediaTemplate from './media.view.html?raw';

/**
 * Media View
 */
export class MediaView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = mediaTemplate;
    (window as any).lucide?.createIcons();
  }

  public get elements() {
    return {
      get refreshMediaBtn() { return document.getElementById('refresh-media-btn'); },
      get mediaArea() { return document.getElementById('media-list-area'); },
      get checkGamepadBtn() { return document.getElementById('check-gamepad-btn'); },
      get gamepadArea() { return document.getElementById('gamepad-list-area'); },
      get specialArea() { return document.getElementById('special-request-area'); }
    };
  }
}

/**
 * Media Binder
 */
export class MediaBinder {
  constructor(
    private readonly view: MediaView,
    private readonly viewModel: MediaViewModel
  ) {}

  public bind() {
    // Specialized Device List Updates from IPC
    this.viewModel.subscribeBtList((list) => this.showRequestList('Bluetooth', list, (id) => this.viewModel.selectBt(id)));
    this.viewModel.subscribeUsbList((list) => this.showRequestList('USB', list, (id) => this.viewModel.selectUsb(id)));
    this.viewModel.subscribeHidList((list) => this.showRequestList('HID', list, (id) => this.viewModel.selectHid(id)));

    document.addEventListener('click', async (event) => {
      const target = event.target as HTMLElement;
      const el = this.view.elements;

      // 1. Refresh Standard Media (Cameras, Mics)
      if (target.id === 'refresh-media-btn' || target.closest('#refresh-media-btn')) {
        try {
          const devs = await this.viewModel.getMediaDevices();
          if (el.mediaArea) {
            el.mediaArea.innerHTML = `
              <div style="margin-bottom: 0.5rem;"><strong>Video Input (${devs.videoIn.length}):</strong><br>${devs.videoIn.map(d => `- ${d.label || 'Unknown Camera'}`).join('<br>') || 'None'}</div>
              <div style="margin-bottom: 0.5rem;"><strong>Audio Input (${devs.audioIn.length}):</strong><br>${devs.audioIn.map(d => `- ${d.label || 'Unknown Mic'}`).join('<br>') || 'None'}</div>
              <div><strong>Audio Output (${devs.audioOut.length}):</strong><br>${devs.audioOut.map(d => `- ${d.label || 'Unknown Speaker'}`).join('<br>') || 'None'}</div>
            `;
          }
        } catch (err) {
          if (el.mediaArea) el.mediaArea.innerText = 'Permission denied or error.';
        }
      }

      // 2. Check Gamepads
      if (target.id === 'check-gamepad-btn' || target.closest('#check-gamepad-btn')) {
        const gamepads = this.viewModel.getGamepads();
        if (el.gamepadArea) {
          el.gamepadArea.innerHTML = gamepads.length > 0 
            ? gamepads.map(g => `<div style="margin-bottom: 0.5rem;">🎮 <strong>${g.id}</strong><br>Index: ${g.index} | Buttons: ${g.buttons.length}</div>`).join('<hr>')
            : 'No gamepads detected.';
        }
      }
      
      // 3. Handle Specialized Selection Buttons (Dynamic)
      if (target.classList.contains('select-dev-btn')) {
        const id = target.getAttribute('data-id');
        const type = target.getAttribute('data-type');
        if (id) {
          if (type === 'Bluetooth') this.viewModel.selectBt(id);
          else if (type === 'USB') this.viewModel.selectUsb(id);
          else if (type === 'HID') this.viewModel.selectHid(id);
          if (el.specialArea) el.specialArea.innerHTML = `Selection sent: ${id.substring(0, 8)}...`;
        }
      }

      if (target.id === 'cancel-dev-btn' || target.closest('#cancel-dev-btn')) {
        this.viewModel.cancelSelect();
        if (el.specialArea) el.specialArea.innerHTML = 'Request cancelled.';
      }
    });
  }

  private showRequestList(type: string, list: any[], onSelect: (id: string) => void) {
    const el = this.view.elements;
    if (!el.specialArea) return;

    el.specialArea.innerHTML = `
      <div style="padding: 0.5rem; border: 1px solid var(--primary); border-radius: 0.5rem; background: rgba(79, 70, 229, 0.1);">
        <strong>Select ${type} Device:</strong><br>
        <div style="margin: 0.5rem 0;">
          ${list.map(d => `
            <button class="btn btn-primary select-dev-btn" data-id="${d.deviceId}" data-type="${type}" style="margin: 0.2rem; padding: 0.3rem 0.6rem; font-size: 0.75rem;">
              ${d.deviceName}
            </button>
          `).join('')}
        </div>
        <button id="cancel-dev-btn" class="btn btn-danger" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Cancel Request</button>
      </div>
    `;
  }
}
