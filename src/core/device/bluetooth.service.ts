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
        ? { filters, optionalServices: ['battery_service', 'device_information'] }
        : { acceptAllDevices: true, optionalServices: ['battery_service', 'device_information'] };

      this.device = await navigator.bluetooth.requestDevice(options);
      return this.device;
    } catch (err) {
      // console.error('Bluetooth Request Device Error:', err);
      throw err;
    }
  }

  /**
   * 장치에 연결하고 GATT 서버를 반환합니다.
   */
  public async connect(): Promise<BluetoothRemoteGATTServer | undefined> {
    if (!this.device || !this.device.gatt) return undefined;
    try {
      return await this.device.gatt.connect();
    } catch (err) {
      console.error('Bluetooth Connection Error:', err);
      return undefined;
    }
  }

  /**
   * 연결된 장치에서 사용 가능한 서비스 목록을 가져옵니다.
   */
  public async getServices(): Promise<BluetoothRemoteGATTService[]> {
    if (!this.device || !this.device.gatt?.connected) return [];
    try {
      return await this.device.gatt.getPrimaryServices();
    } catch (err) {
      console.error('Error fetching services:', err);
      return [];
    }
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
