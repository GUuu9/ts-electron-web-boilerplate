/**
 * USB 및 HID 장치 연결/통신 서비스
 * WebUSB 및 WebHID API를 활용하여 웹과 데스크탑에서 공용입니다.
 */
export class UsbService {
  /**
   * USB 장치를 요청합니다. (예: 전용 마이크, USB 기기)
   */
  public async requestUsbDevice(filters?: USBDeviceFilter[]): Promise<USBDevice | null> {
    try {
      return await navigator.usb.requestDevice({ filters: filters || [] });
    } catch (err) {
      console.error('USB Request Device Error:', err);
      return null;
    }
  }

  /**
   * HID 장치를 요청합니다. (예: 게임패드, 커스텀 하드웨어 컨트롤러)
   */
  public async requestHidDevice(): Promise<HIDDevice | null> {
    try {
      const devices = await navigator.hid.requestDevice({ filters: [] });
      return devices[0] || null;
    } catch (err) {
      console.error('HID Request Device Error:', err);
      return null;
    }
  }

  /**
   * 게임패드(Gamepad API) 상태를 가져옵니다.
   */
  public getGamepads(): (Gamepad | null)[] {
    return navigator.getGamepads();
  }
}
