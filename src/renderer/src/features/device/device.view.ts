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
      case 'serial':
        return this.getSerialTemplate();
      default:
        return '';
    }
  }

  private getSerialTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- 1. Connection Section (Top) -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="cable" style="color: #60a5fa; width: 20px;"></i>
              <h5 style="margin: 0; color: #60a5fa;">1. Serial Connection Settings</h5>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <div class="form-group">
                <label>Select Port</label>
                <div style="display: flex; gap: 0.5rem; align-items: stretch;">
                  <select id="serial-port-select" class="primary" style="flex: 1; background: var(--bg-card); border: 1px solid #60a5fa; color: #60a5fa; padding: 10px; border-radius: 6px; cursor: pointer;">
                    <option value="">Scan for ports...</option>
                  </select>
                  <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 16px; background: rgba(96, 165, 250, 0.1); border: 1px solid #60a5fa; color: #60a5fa; border-radius: 6px; min-width: 100px;" onclick="window.serialController.refreshPorts()">
                    <i data-lucide="refresh-cw" style="width: 14px; height: 14px;"></i>
                    <span>Scan</span>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Baud Rate</label>
                <select id="serial-baud-select" class="primary" style="width: 100%; background: var(--bg-card); border: 1px solid #60a5fa; color: #60a5fa; padding: 10px; border-radius: 6px; cursor: pointer;">
                  <option value="9600">9600 bps</option>
                  <option value="19200">19200 bps</option>
                  <option value="38400">38400 bps</option>
                  <option value="57600">57600 bps</option>
                  <option value="115200" selected>115200 bps</option>
                </select>
              </div>
            </div>

            <div class="button-group" style="margin-top: 2rem; justify-content: flex-end; gap: 0.75rem;">
              <button id="serial-connect-btn" class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 140px;" onclick="window.serialController.connect()">
                <i data-lucide="link" style="width: 16px; height: 16px;"></i>
                <span>Connect</span>
              </button>
              <button id="serial-disconnect-btn" class="primary" style="display: none; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 140px; background: #ef4444;" onclick="window.serialController.disconnect()">
                <i data-lucide="link-2-off" style="width: 16px; height: 16px;"></i>
                <span>Disconnect</span>
              </button>
            </div>
          </div>

          <!-- 2. Data Terminal Section (Bottom) -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i data-lucide="terminal" style="color: #10b981; width: 20px;"></i>
                <h5 style="margin: 0; color: #10b981;">2. Serial Terminal</h5>
              </div>
              <button class="primary" style="display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.1); width: auto; padding: 6px 12px; font-size: 0.75rem;" onclick="document.getElementById('serial-log').value=''">
                <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i> Clear Terminal
              </button>
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label>Data to Send (Auto appends \\n)</label>
              <div style="display: flex; gap: 0.5rem; align-items: stretch;">
                <input type="text" id="serial-send-input" placeholder="Enter command or message..." style="flex: 1; font-family: monospace; padding: 10px;">
                <button id="serial-send-btn" class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 0 20px; min-width: 100px;" onclick="window.serialController.send()" disabled>
                  <i data-lucide="send" style="width: 14px; height: 14px;"></i>
                  <span>Send</span>
                </button>
              </div>
            </div>

            <div class="form-group">
              <label>Terminal Output (RX/TX Log)</label>
              <textarea id="serial-log" style="height: 300px; font-family: 'Cascadia Code', 'Fira Code', monospace; font-size: 0.8rem; line-height: 1.5; background: #000; color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); padding: 1rem;" readonly placeholder="Connected port logs will appear here..."></textarea>
            </div>
          </div>
        </div>
      </div>`;
  }

  private getBluetoothTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="bluetooth" style="color: #60a5fa; width: 20px;"></i>
            <h5 style="margin: 0; color: #60a5fa;">Bluetooth Low Energy (BLE)</h5>
          </div>

          <div class="form-group">
            <label>Service UUID (Optional Filter)</label>
            <input type="text" id="bt-uuid" placeholder="e.g. 0000180d-0000-1000-8000-00805f9b34fb" style="padding: 10px;">
          </div>

          <div class="button-group" style="margin-top: 1.5rem;">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px;" onclick="window.deviceController.testBluetooth()">
              <i data-lucide="search" style="width: 16px; height: 16px;"></i>
              <span>Scan for Devices</span>
            </button>
          </div>
        </div>
      </div>`;
  }

  private getUsbTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <!-- WebUSB Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="usb" style="color: #f87171; width: 20px;"></i>
              <h5 style="margin: 0; color: #f87171;">WebUSB API</h5>
            </div>
            
            <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.5rem; line-height: 1.5;">
              일반적인 USB 장치(직렬 통신, 전용 하드웨어 등)와 직접 통신합니다.
            </p>

            <div class="form-group">
              <label>Vendor ID (Filter, e.g. 0x1234)</label>
              <input type="text" id="usb-vendor" placeholder="Enter Hex or Decimal ID" style="padding: 10px;">
            </div>

            <div class="button-group" style="margin-top: 1.5rem;">
              <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px; background: #ef4444;" onclick="window.deviceController.testUsb()">
                <i data-lucide="plus-square" style="width: 16px; height: 16px;"></i>
                <span>Request USB Device</span>
              </button>
            </div>
          </div>

          <!-- WebHID Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="mouse-pointer-2" style="color: #fbbf24; width: 20px;"></i>
              <h5 style="margin: 0; color: #fbbf24;">WebHID API</h5>
            </div>

            <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.5rem; line-height: 1.5;">
              마우스, 키보드, 게임패드, 특수 컨트롤러 등 HID 규격 장치와 통신합니다.
            </p>

            <div class="button-group">
              <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 180px; background: #f59e0b;" onclick="window.deviceController.testHid()">
                <i data-lucide="cpu" style="width: 16px; height: 16px;"></i>
                <span>Request HID Device</span>
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  private getMediaTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="video" style="color: #10b981; width: 20px;"></i>
            <h5 style="margin: 0; color: #10b981;">Media Devices (Audio/Video)</h5>
          </div>

          <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1.5rem; line-height: 1.5;">
            시스템에 연결된 마이크, 카메라, 스피커 목록을 조회하고 스트림을 테스트합니다.
          </p>

          <div class="button-group">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 200px; background: #059669;" onclick="window.deviceController.testMedia()">
              <i data-lucide="list" style="width: 16px; height: 16px;"></i>
              <span>Enumerate Media Devices</span>
            </button>
          </div>

          <div id="media-list" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <!-- 장치 목록이 여기에 동적으로 추가됨 -->
          </div>
        </div>
      </div>`;
  }
}
