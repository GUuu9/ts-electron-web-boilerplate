export interface DeviceItem {
  deviceId: string;
  deviceName: string;
}

export class DeviceModalView {
  private modal: HTMLElement = document.getElementById('device-picker-modal')!;
  private listContainer: HTMLElement = document.getElementById('device-list-container')!;
  private modalTitle: HTMLElement = document.getElementById('modal-title')!;

  constructor(private onDeviceSelected: (deviceId: string) => void) {}

  show(title: string): void {
    this.modalTitle.innerText = title;
    this.modal.style.display = 'flex';
  }

  hide(): void {
    this.modal.style.display = 'none';
  }

  renderList(items: DeviceItem[]): void {
    this.listContainer.innerHTML = '';
    items.forEach((device) => {
      const item = document.createElement('div');
      item.className = 'device-item';
      item.innerHTML = `
        <div class="device-info">
          <span>${device.deviceName}</span>
          <small>${device.deviceId}</small>
        </div>
      `;
      item.onclick = () => this.onDeviceSelected(device.deviceId);
      this.listContainer.appendChild(item);
    });
  }
}
