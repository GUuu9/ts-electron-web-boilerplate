/**
 * 블루투스(Bluetooth) 장치 연결 및 통신 서비스
 * Web Bluetooth API를 기반으로 하며, 웹과 데스크탑 공용입니다.
 */
export class BluetoothService {
  private device: BluetoothDevice | null = null;

  /**
   * 블루투스 장치를 검색하고 선택합니다.
   * @param filters 장치 검색 필터 (예: 서비스 UUID 등)
   */
  public async requestDevice(filters?: BluetoothLEScanFilter[]): Promise<BluetoothDevice | null> {
    try {
      // filters가 있으면 filters를 사용하고, 없으면 모든 장치 허용(acceptAllDevices)을 사용합니다.
      const options: RequestDeviceOptions = filters 
        ? { filters, optionalServices: ['battery_service'] }
        : { acceptAllDevices: true, optionalServices: ['battery_service'] };

      this.device = await navigator.bluetooth.requestDevice(options);
      return this.device;
    } catch (err) {
      console.error('Bluetooth Request Device Error:', err);
      return null;
    }
  }

  /**
   * 장치에 연결합니다.
   */
  public async connect(): Promise<BluetoothRemoteGATTServer | undefined> {
    if (!this.device || !this.device.gatt) return undefined;
    return await this.device.gatt.connect();
  }

  /**
   * 연결을 해제합니다.
   */
  public disconnect(): void {
    if (this.device && this.device.gatt?.connected) {
      this.device.gatt.disconnect();
    }
  }
}
