import { MediaViewModel } from './media.viewmodel.js';

/**
 * Media View
 */
export class MediaView {
  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="network-view">
        <h3><i data-lucide="settings-2"></i> Media & Input Devices</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <!-- 1. Standard Media -->
          <section>
            <h4><i data-lucide="mic"></i> Cameras & Microphones</h4>
            <button id="refresh-media-btn">Refresh Devices</button>
            <div id="media-list-area" style="margin-top: 10px; font-size: 0.85em; max-height: 150px; overflow-y: auto; background: #f9f9f9; padding: 5px;"></div>
          </section>

          <!-- 2. Gamepads -->
          <section>
            <h4><i data-lucide="gamepad-2"></i> Game Controllers</h4>
            <button id="check-gamepad-btn">Check Gamepads</button>
            <div id="gamepad-list-area" style="margin-top: 10px; font-size: 0.85em; max-height: 150px; overflow-y: auto; background: #f9f9f9; padding: 5px;"></div>
          </section>
        </div>

        <hr style="margin: 20px 0;" />

        <!-- 3. Specialized (BT/USB/HID) -->
        <section>
          <h4><i data-lucide="plug-zap"></i> Specialized Device Requests</h4>
          <p style="font-size: 0.8em; color: #666;">These will populate when the system triggers a device selection request.</p>
          <div id="special-request-area" style="padding: 10px; border: 1px dashed #ccc; background: #fafafa; min-height: 50px;">
            Waiting for device request...
          </div>
        </section>
      </div>
    `;
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
      if (target.id === 'refresh-media-btn') {
        try {
          const devs = await this.viewModel.getMediaDevices();
          if (el.mediaArea) {
            el.mediaArea.innerHTML = `
              <strong>Video Input (${devs.videoIn.length}):</strong><br>
              ${devs.videoIn.map(d => `- ${d.label || 'Unknown Camera'}`).join('<br>') || 'None'}
              <br><br><strong>Audio Input (${devs.audioIn.length}):</strong><br>
              ${devs.audioIn.map(d => `- ${d.label || 'Unknown Mic'}`).join('<br>') || 'None'}
              <br><br><strong>Audio Output (${devs.audioOut.length}):</strong><br>
              ${devs.audioOut.map(d => `- ${d.label || 'Unknown Speaker'}`).join('<br>') || 'None'}
            `;
          }
        } catch (err) {
          if (el.mediaArea) el.mediaArea.innerText = 'Permission denied or error.';
        }
      }

      // 2. Check Gamepads
      if (target.id === 'check-gamepad-btn') {
        const gamepads = this.viewModel.getGamepads();
        if (el.gamepadArea) {
          el.gamepadArea.innerHTML = gamepads.length > 0 
            ? gamepads.map(g => `🎮 <strong>${g.id}</strong><br>Index: ${g.index} | Buttons: ${g.buttons.length}`).join('<hr>')
            : 'No gamepads detected. Connect a controller and press any button.';
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

      if (target.id === 'cancel-dev-btn') {
        this.viewModel.cancelSelect();
        if (el.specialArea) el.specialArea.innerHTML = 'Request cancelled.';
      }
    });
  }

  private showRequestList(type: string, list: any[], onSelect: (id: string) => void) {
    const el = this.view.elements;
    if (!el.specialArea) return;

    el.specialArea.innerHTML = `
      <div style="padding: 5px; border: 1px solid orange; margin-bottom: 5px;">
        <strong>Select ${type} Device:</strong><br>
        <div style="margin: 5px 0;">
          ${list.map(d => `
            <button class="select-dev-btn" data-id="${d.deviceId}" data-type="${type}" style="margin: 2px; padding: 4px 8px; cursor: pointer;">
              ${d.deviceName}
            </button>
          `).join('')}
        </div>
        <button id="cancel-dev-btn" style="color: red; font-size: 0.8em; cursor: pointer;">Cancel Request</button>
      </div>
    `;
  }
}
