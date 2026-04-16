import { container } from '../../../../core/di/container.renderer.js';
import type { BluetoothService } from '../../../../core/device/bluetooth.service.js';
import type { UsbService } from '../../../../core/device/usb.service.js';
import type { MediaService } from '../../../../core/device/media.service.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

const SERVICE_NAMES: Record<string, string> = {
  '0000180d': 'Heart Rate',
  '0000180f': 'Battery Service',
  '00001812': 'HID (Input Device)'
};

export class DeviceController {
  private modal: HTMLElement | null = null;
  private listContainer: HTMLElement | null = null;
  private modalTitle: HTMLElement | null = null;
  
  private activeStream: MediaStream | null = null;
  private audioInterval: any = null;

  constructor(private readonly logger: UILoggerService) {}

  private initModalRefs() {
    this.modal = document.getElementById('device-picker-modal');
    this.listContainer = document.getElementById('device-list-container');
    this.modalTitle = document.getElementById('modal-title');
  }

  private get electronAPI() {
    return (window as any).electronAPI;
  }

  private renderDeviceList(list: any[], type: 'bt' | 'usb' | 'hid') {
    if (!this.listContainer) return;
    this.listContainer.innerHTML = '';
    list.forEach(device => {
      const item = document.createElement('div');
      item.className = 'device-item';
      item.innerHTML = `<div class="device-info"><span>${device.deviceName}</span><small>${device.deviceId}</small></div>`;
      item.onclick = () => {
        if (type === 'bt') this.electronAPI.devices.selectBluetooth(device.deviceId);
        else if (type === 'usb') this.electronAPI.devices.selectUsb(device.deviceId);
        else if (type === 'hid') this.electronAPI.devices.selectHid(device.deviceId);
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
      if (this.electronAPI?.devices) this.electronAPI.devices.onBluetoothList((list: any[]) => this.renderDeviceList(list, 'bt'));
      const bt = container.get<BluetoothService>('BluetoothService');
      const device = await bt.requestDevice();
      if (!device) return;
      const server = await bt.connect();
      if (server?.connected) {
        this.logger.log(`[BT] Connected to ${device.name}`);
        const services = await bt.getServices();
        services.forEach(s => this.logger.log(`• Service: ${SERVICE_NAMES[s.uuid.substring(0, 8)] || 'Custom'}`));
      }
    } catch (err: any) {
      this.cancelScan();
    }
  }

  public async testUsb() {
    this.initModalRefs();
    if (this.modalTitle) this.modalTitle.innerText = '🔍 USB 장치 탐색';
    if (this.modal) this.modal.style.display = 'flex';
    try {
      if (this.electronAPI?.devices) this.electronAPI.devices.onUsbList((list: any[]) => this.renderDeviceList(list, 'usb'));
      await container.get<UsbService>('UsbService').requestUsbDevice();
    } catch (err) { this.cancelScan(); }
  }

  public async testHid() {
    this.initModalRefs();
    if (this.modalTitle) this.modalTitle.innerText = '🔍 HID 장치 탐색';
    if (this.modal) this.modal.style.display = 'flex';
    try {
      if (this.electronAPI?.devices) this.electronAPI.devices.onHidList((list: any[]) => this.renderDeviceList(list, 'hid'));
      await container.get<UsbService>('UsbService').requestHidDevice();
    } catch (err) { this.cancelScan(); }
  }

  public cancelScan() {
    if (this.modal) this.modal.style.display = 'none';
    if (this.electronAPI?.devices) this.electronAPI.devices.cancelSelect();
  }

  /**
   * 미디어 장치 통합 관리 (마이크, 카메라, 스피커)
   */
  public async testMedia(): Promise<void> {
    this.logger.log('[Media] Discovering all devices...');
    
    // 각 유형별 저장된 기본 ID 가져오기
    const defaults = {
      audioinput: localStorage.getItem('default-mic-id'),
      videoinput: localStorage.getItem('default-cam-id'),
      audiooutput: localStorage.getItem('default-speaker-id')
    };

    try {
      const media = container.get<MediaService>('MediaService');
      
      // 권한 획득 (Label 노출용)
      const tempStream = await media.getAudioStream();
      if (tempStream) media.stopStream(tempStream);

      const devices = await media.enumerateDevices();
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

        // [Test] 버튼 클릭
        item.querySelector('.test-btn')?.addEventListener('click', (e) => {
          e.stopPropagation();
          if (d.kind === 'audioinput') this.startMicrophoneTest(d.deviceId, label);
          else if (d.kind === 'videoinput') this.startCameraTest(d.deviceId, label);
          else if (d.kind === 'audiooutput') this.startSpeakerTest(d.deviceId, label);
        });

        // [Default] 버튼 클릭
        item.querySelector('.set-btn')?.addEventListener('click', (e) => {
          e.stopPropagation();
          const storageKey = d.kind === 'audioinput' ? 'default-mic-id' : d.kind === 'videoinput' ? 'default-cam-id' : 'default-speaker-id';
          localStorage.setItem(storageKey, d.deviceId);
          this.logger.log(`[Media] Set default ${d.kind}: ${label}`);
          this.testMedia();
        });

        listArea.appendChild(item);
      });
    } catch (err: any) { this.logger.log(`Media Error: ${err.message}`, true); }
  }

  // --- 카메라 테스트 (새로운 기능) ---
  private async startCameraTest(deviceId: string, label: string) {
    this.logger.log(`[Media] Camera Test: ${label}`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: { exact: deviceId } } });
      this.initModalRefs();
      if (this.modalTitle) this.modalTitle.innerText = '📷 카메라 테스트';
      if (this.listContainer) {
        this.listContainer.innerHTML = `<video id="test-video" autoplay playsinline style="width:100%; border-radius:1rem; background:#000;"></video>`;
        const video = document.getElementById('test-video') as HTMLVideoElement;
        video.srcObject = stream;
      }
      if (this.modal) this.modal.style.display = 'flex';
      
      // 5초 후 자동 종료
      setTimeout(() => {
        stream.getTracks().forEach(t => t.stop());
        if (this.modal) this.modal.style.display = 'none';
        this.logger.log(`[Media] Camera test ended.`);
      }, 5000);
    } catch (e: any) { this.logger.log(`Camera Test Error: ${e.message}`, true); }
  }

  // --- 스피커 테스트 (새로운 기능) ---
  private async startSpeakerTest(deviceId: string, label: string) {
    this.logger.log(`[Media] Speaker Test (Beep): ${label}`);
    try {
      const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
      // @ts-ignore (setSinkId는 일부 환경에서 실험적 API)
      if (audio.setSinkId) {
        // @ts-ignore
        await audio.setSinkId(deviceId);
      }
      audio.play();
      this.logger.log(`[Media] Playing test sound to: ${label}`);
    } catch (e: any) { this.logger.log(`Speaker Test Error: ${e.message}`, true); }
  }

  // --- 마이크 테스트 (기존 기능) ---
  private async startMicrophoneTest(deviceId: string, label: string) {
    this.stopMicrophoneTest();
    this.logger.log(`[Media] Mic Test: ${label}`);
    try {
      const stream = await container.get<MediaService>('MediaService').getAudioStream(deviceId);
      if (!stream) return;
      this.activeStream = stream;
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      audioContext.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 64;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      this.audioInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const bar = '█'.repeat(Math.round(average / 5));
        if (average > 2) console.log(`[Mic Level] ${bar}`);
      }, 100);
      setTimeout(() => this.stopMicrophoneTest(), 5000);
    } catch (err: any) { this.logger.log(`Mic Test Error: ${err.message}`, true); }
  }

  private stopMicrophoneTest() {
    if (this.audioInterval) clearInterval(this.audioInterval);
    if (this.activeStream) {
      container.get<MediaService>('MediaService').stopStream(this.activeStream);
      this.activeStream = null;
      this.logger.log(`[Media] Mic test ended.`);
    }
  }
}
