import { SerialPort } from 'serialport';

export interface SerialPortInfo {
  path: string;
  manufacturer?: string;
  serialNumber?: string;
  pnpId?: string;
  locationId?: string;
  vendorId?: string;
  productId?: string;
}

export class SerialService {
  private ports: Map<string, SerialPort> = new Map();

  constructor() {}

  /**
   * 사용 가능한 시리얼 포트 목록을 가져옵니다.
   */
  async listPorts(): Promise<SerialPortInfo[]> {
    try {
      const ports = await SerialPort.list();
      return ports.map(port => ({
        path: port.path,
        manufacturer: port.manufacturer,
        serialNumber: port.serialNumber,
        pnpId: port.pnpId,
        locationId: port.locationId,
        vendorId: port.vendorId,
        productId: port.productId,
      }));
    } catch (error: any) {
      console.error('[SerialService] 포트 목록 조회 실패:', error.message);
      return [];
    }
  }

  /**
   * 시리얼 포트를 엽니다.
   */
  async openPort(path: string, baudRate: number = 9600): Promise<boolean> {
    if (this.ports.has(path)) {
      console.warn('[SerialService] 포트가 이미 열려 있습니다:', path);
      return true;
    }

    return new Promise((resolve) => {
      const port = new SerialPort({ path, baudRate, autoOpen: false });

      port.open((err) => {
        if (err) {
          console.error(`[SerialService] 포트 열기 실패 (${path}):`, err.message);
          resolve(false);
        } else {
          this.ports.set(path, port);
          console.log(`[SerialService] 포트 열림: ${path} (${baudRate}bps)`);
          
          // 기본 에러 핸들러 등록
          port.on('error', (error) => {
            console.error(`[SerialService] 포트 에러 (${path}):`, error.message);
          });

          resolve(true);
        }
      });
    });
  }

  /**
   * 시리얼 포트를 닫습니다.
   */
  async closePort(path: string): Promise<boolean> {
    const port = this.ports.get(path);
    if (!port) {
      console.warn('[SerialService] 닫을 포트를 찾을 수 없습니다:', path);
      return false;
    }

    return new Promise((resolve) => {
      port.close((err) => {
        if (err) {
          console.error(`[SerialService] 포트 닫기 실패 (${path}):`, err.message);
          resolve(false);
        } else {
          this.ports.delete(path);
          console.log(`[SerialService] 포트 닫힘: ${path}`);
          resolve(true);
        }
      });
    });
  }

  /**
   * 데이터를 전송합니다.
   */
  async write(path: string, data: string | Buffer): Promise<boolean> {
    const port = this.ports.get(path);
    if (!port || !port.isOpen) {
      console.error(`[SerialService] 데이터 전송 실패: 포트가 열려 있지 않음 (${path})`);
      return false;
    }


    return new Promise((resolve) => {
      port.write(data, (err) => {
        if (err) {
          console.error(`[SerialService] 데이터 쓰기 에러 (${path}):`, err.message);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * 데이터 수신 리스너를 등록합니다.
   */
  onData(path: string, callback: (data: Buffer) => void): void {
    const port = this.ports.get(path);
    if (port) {
      port.on('data', callback);
    } else {
      console.error(`[SerialService] 리스너 등록 실패: 포트를 찾을 수 없음 (${path})`);
    }
  }
}
