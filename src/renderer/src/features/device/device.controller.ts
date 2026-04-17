import type { UILoggerService } from '../../core/ui-logger.service.js';
import { BluetoothController } from './bluetooth.controller.js';
import { UsbController } from './usb.controller.js';
import { MediaController } from './media.controller.ts';

export class DeviceController {
  private modal: HTMLElement | null = null;
  private listContainer: HTMLElement | null = null;
  private modalTitle: HTMLElement | null = null;

  constructor(
    private readonly logger: UILoggerService,
    private readonly bluetooth: BluetoothController,
    private readonly usb: UsbController,
    private readonly media: MediaController
  ) {}

  private initModalRefs() {
    this.modal = document.getElementById('device-picker-modal');
    this.listContainer = document.getElementById('device-list-container');
    this.modalTitle = document.getElementById('modal-title');
  }

  private renderDeviceList(list: any[], type: 'bt' | 'usb' | 'hid') {
    if (!this.listContainer) return;
    this.listContainer.innerHTML = '';
    list.forEach(device => {
      const item = document.createElement('div');
      item.className = 'device-item';
      item.innerHTML = `<div class="device-info"><span>${device.deviceName}</span><small>${device.deviceId}</small></div>`;
      item.onclick = () => {
        const api = (window as any).electronAPI;
        if (type === 'bt') api.devices.selectBluetooth(device.deviceId);
        else if (type === 'usb') api.devices.selectUsb(device.deviceId);
        else if (type === 'hid') api.devices.selectHid(device.deviceId);
        if (this.modal) this.modal.style.display = 'none';
      };
      this.listContainer?.appendChild(item);
    });
  }

  public async testBluetooth(): Promise<void> {
    this.initModalRefs();
    if (this.modalTitle) this.modalTitle.innerText = '🔍 Bluetooth 장치 탐색';
    if (this.modal) this.modal.style.display = 'flex';
    
    try {
      await this.bluetooth.testBluetooth(
        (list) => this.renderDeviceList(list, 'bt'),
        () => { if (this.modal) this.modal.style.display = 'none'; }
      );
    } catch (err) {
      this.cancelScan();
    }
  }

  public async testUsb() {
    this.initModalRefs();
    if (this.modalTitle) this.modalTitle.innerText = '🔍 USB 장치 탐색';
    if (this.modal) this.modal.style.display = 'flex';
    
    try {
      await this.usb.testUsb(
        (list) => this.renderDeviceList(list, 'usb'),
        () => { if (this.modal) this.modal.style.display = 'none'; }
      );
    } catch (err) {
      this.cancelScan();
    }
  }

  public async testHid() {
    this.initModalRefs();
    if (this.modalTitle) this.modalTitle.innerText = '🔍 HID 장치 탐색';
    if (this.modal) this.modal.style.display = 'flex';
    
    try {
      await this.usb.testHid(
        (list) => this.renderDeviceList(list, 'hid'),
        () => { if (this.modal) this.modal.style.display = 'none'; }
      );
    } catch (err) {
      this.cancelScan();
    }
  }

  public cancelScan() {
    if (this.modal) this.modal.style.display = 'none';
    this.bluetooth.cancelScan();
    this.usb.cancelScan();
  }

  public async testMedia(): Promise<void> {
    this.logger.log('[Media] Discovering all devices...');
    const defaults = {
      audioinput: localStorage.getItem('default-mic-id'),
      videoinput: localStorage.getItem('default-cam-id'),
      audiooutput: localStorage.getItem('default-speaker-id')
    };

    try {
      const devices = await this.media.enumerateDevices();
      const listArea = document.getElementById('media-list');
      if (!listArea) return;
      listArea.innerHTML = '';

      devices.forEach(d => {
        const isDefault = d.deviceId === (defaults as any)[d.kind];
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
          if (d.kind === 'audioinput') this.media.startMicrophoneTest(d.deviceId, label);
          else if (d.kind === 'videoinput') this.handleCameraTest(d.deviceId, label);
          else if (d.kind === 'audiooutput') this.media.startSpeakerTest(d.deviceId, label);
        });

        item.querySelector('.set-btn')?.addEventListener('click', (e) => {
          e.stopPropagation();
          const storageKey = d.kind === 'audioinput' ? 'default-mic-id' : d.kind === 'videoinput' ? 'default-cam-id' : 'default-speaker-id';
          localStorage.setItem(storageKey, d.deviceId);
          this.logger.log(`[Media] Set default ${d.kind}: ${label}`);
          this.testMedia();
        });

        listArea.appendChild(item);
      });
    } catch (err: any) {
      this.logger.log(`Media Error: ${err.message}`, true);
    }
  }

  private async handleCameraTest(deviceId: string, label: string) {
    await this.media.startCameraTest(deviceId, label, (stream) => {
      this.initModalRefs();
      if (this.modalTitle) this.modalTitle.innerText = '📷 카메라 테스트';
      if (this.listContainer) {
        this.listContainer.innerHTML = `<video id="test-video" autoplay playsinline style="width:100%; border-radius:1rem; background:#000;"></video>`;
        const video = document.getElementById('test-video') as HTMLVideoElement;
        video.srcObject = stream;
      }
      if (this.modal) this.modal.style.display = 'flex';
      
      setTimeout(() => {
        if (this.modal) this.modal.style.display = 'none';
      }, 5000);
    });
  }
}
