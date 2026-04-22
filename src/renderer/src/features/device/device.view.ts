/**
 * DeviceView
 * 역할: 하드웨어 장치 제어(Bluetooth, USB, Media) 관련 UI 템플릿을 생성합니다.
 */
export class DeviceView {
  /**
   * 하위 탭에 맞는 HTML 컨텐츠를 반환합니다.
   */
  public getHtml(subType: string): string {
    switch (subType) {
      case 'bluetooth':
        return this.getBluetoothTemplate();
      case 'usb':
        return this.getUsbTemplate();
      case 'media':
        return this.getMediaTemplate();
      default:
        return '';
    }
  }

  private getBluetoothTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>Bluetooth LE</h4>
          <div class="form-group">
            <label>Service UUID (Optional)</label>
            <input type="text" id="bt-uuid" placeholder="e.g. 0000180d-0000-1000-8000-00805f9b34fb">
          </div>
          <div class="button-group">
            <button class="primary" onclick="window.deviceController.testBluetooth()">Scan for Device</button>
          </div>
        </div>
      </div>`;
  }

  private getUsbTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>WebUSB API</h4>
          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
            일반적인 USB 장치(직렬 통신, 전용 기기 등)와 통신합니다.
          </p>
          <div class="form-group">
            <label>Vendor ID (필터, 예: 0x1234)</label>
            <input type="text" id="usb-vendor" placeholder="Hex 또는 10진수 입력">
          </div>
          <div class="button-group">
            <button class="primary" onclick="window.deviceController.testUsb()">Request USB Device</button>
          </div>
        </div>

        <div class="test-section" style="margin-top: 1.5rem;">
          <h4>WebHID API</h4>
          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
            마우스, 키보드, 게임패드 등 입력 장치와 통신합니다.
          </p>
          <div class="button-group">
            <button class="primary" onclick="window.deviceController.testHid()">Request HID Device</button>
          </div>
        </div>
      </div>`;
  }

  private getMediaTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>Media Devices</h4>
          <div class="button-group">
            <button class="primary" onclick="window.deviceController.testMedia()">List Microphones/Cameras</button>
          </div>
          <div id="media-list" style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-dim);"></div>
        </div>
      </div>`;
  }
}
