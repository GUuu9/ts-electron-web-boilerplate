import type { UILoggerService } from '../../core/ui-logger.service.js';
import { BluetoothController } from './bluetooth.controller.js';
import { UsbController } from './usb.controller.js';
import { MediaController } from './media.controller.js';
import { DeviceModalView } from './device-modal.view.js';

/**
 * DeviceController는 하드웨어 장치 관리 도메인의 오케스트레이터입니다.
 * 각 하드웨어별 컨트롤러(Bluetooth, USB, Media)를 조정하고 모달 뷰의 생명주기를 관리합니다.
 */
export class DeviceController {
  private modalView: DeviceModalView;
  private readonly media: MediaController;

  constructor(
    private readonly logger: UILoggerService,
    private readonly bluetooth: BluetoothController,
    private readonly usb: UsbController
  ) {
    // 장치 선택 시 호출될 콜백 정의
    this.modalView = new DeviceModalView((deviceId) => this.handleDeviceSelected(deviceId));
    this.media = new MediaController(logger, (stream) => {
      this.modalView.show('📷 카메라 테스트');
      const container = document.getElementById('device-list-container')!;
      container.innerHTML = `<video id="test-video" autoplay playsinline style="width:100%; border-radius:1rem; background:#000;"></video>`;
      const video = document.getElementById('test-video') as HTMLVideoElement;
      video.srcObject = stream;
    });
  }

  /**
   * 장치 목록에서 사용자가 특정 장치를 선택했을 때의 처리 로직
   */
  private handleDeviceSelected(deviceId: string) {
    const api = (window as any).electronAPI;
    // 현재 모달 상태에 따라 적절한 API 호출 (향후 이벤트 버스로 개선 예정)
    // 현재는 예시로 USB/BT를 구분하는 상태 로직이 필요할 수 있음
    this.logger.log(`[Device] 선택된 장치: ${deviceId}`);
    this.modalView.hide();
  }

  /**
   * 블루투스 장치 탐색 UI를 활성화하고 탐색을 시작합니다.
   */
  public async testBluetooth(): Promise<void> {
    this.modalView.show('🔍 Bluetooth 장치 탐색');
    try {
      await this.bluetooth.testBluetooth(
        (list) => this.modalView.renderList(list.map(d => ({ deviceId: d.deviceId, deviceName: d.deviceName }))),
        () => this.modalView.hide()
      );
    } catch (err) {
      this.cancelScan();
    }
  }

  /**
   * USB 장치 탐색 UI를 활성화하고 탐색을 시작합니다.
   */
  public async testUsb() {
    this.modalView.show('🔍 USB 장치 탐색');
    try {
      await this.usb.testUsb(
        (list) => this.modalView.renderList(list.map(d => ({ deviceId: d.deviceId, deviceName: d.deviceName }))),
        () => this.modalView.hide()
      );
    } catch (err) {
      this.cancelScan();
    }
  }

  /**
   * HID 장치 탐색 UI를 활성화하고 탐색을 시작합니다.
   */
  public async testHid() {
    this.modalView.show('🔍 HID 장치 탐색');
    try {
      await this.usb.testHid(
        (list) => this.modalView.renderList(list.map(d => ({ deviceId: d.deviceId, deviceName: d.deviceName }))),
        () => this.modalView.hide()
      );
    } catch (err) {
      this.cancelScan();
    }
  }

  /**
   * 모든 장치 탐색 작업을 취소하고 모달을 닫습니다.
   */
  public cancelScan() {
    this.modalView.hide();
    this.bluetooth.cancelScan();
    this.usb.cancelScan();
  }


  /**
   * 미디어 장치 탐색 UI를 활성화하고 장치 목록을 갱신합니다.
   */
  public async testMedia(): Promise<void> {
    this.logger.log('[Media] Discovering all devices...');
    await this.media.refresh();
  }

}
