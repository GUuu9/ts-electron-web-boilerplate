export interface MediaDevice {
  deviceId: string;
  kind: string;
  label: string;
}

export class MediaView {
  constructor(
    private onTest: (kind: string, id: string, label: string) => void,
    private onSetDefault: (kind: string, id: string, label: string) => void
  ) {}

  renderList(devices: MediaDevice[], defaults: Record<string, string | null>): void {
    const listArea = document.getElementById('media-list');
    if (!listArea) {
      console.error('[MediaView] media-list 요소를 찾을 수 없습니다.');
      return;
    }
    listArea.innerHTML = '';
    devices.forEach((d) => {
      const isDefault = d.deviceId === defaults[d.kind];
      const item = document.createElement('div');
      item.className = `device-item ${isDefault ? 'active' : ''}`;
      
      const label = d.label || `${d.kind} (Unnamed)`;
      const icon = d.kind === 'audioinput' ? '🎤' : d.kind === 'videoinput' ? '📷' : '🔊';
      
      item.innerHTML = `
        <div class="device-info">
          <span>${isDefault ? '🌟 ' : icon + ' '}${label}</span>
          <small>${d.kind} | ${d.deviceId.substring(0, 8)}...</small>
        </div>
        <div class="device-actions">
          <button class="primary test-btn" style="padding:4px 10px;font-size:0.75rem">Test</button>
          <button class="primary set-btn" style="background:#059669;padding:4px 10px;font-size:0.75rem">Default</button>
        </div>
      `;

      item.querySelector('.test-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onTest(d.kind, d.deviceId, label);
      });

      item.querySelector('.set-btn')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onSetDefault(d.kind, d.deviceId, label);
      });

      listArea.appendChild(item);
    });
  }
}
