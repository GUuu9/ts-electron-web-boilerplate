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

/**
 * Serial Server (Backend Service)
 */
export class SerialServer {
  private ports: Map<string, SerialPort> = new Map();

  /**
   * 사용 가능한 시리얼 포트 목록을 가져옵니다.
   */
  public async listPorts(): Promise<SerialPortInfo[]> {
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
      console.error('[SerialServer] 포트 목록 조회 실패:', error.message);
      return [];
    }
  }

  /**
   * 시리얼 포트를 엽니다.
   */
  public async openPort(path: string, baudRate: number, onData: (data: string) => void): Promise<boolean> {
    if (this.ports.has(path)) {
      console.warn('[SerialServer] 포트가 이미 열려 있습니다:', path);
      return true;
    }

    return new Promise((resolve) => {
      const port = new SerialPort({ path, baudRate, autoOpen: false });

      port.open((err) => {
        if (err) {
          console.error(`[SerialServer] 포트 열기 실패 (${path}):`, err.message);
          resolve(false);
        } else {
          this.ports.set(path, port);
          console.log(`[SerialServer] 포트 열림: ${path} (${baudRate}bps)`);
          
          port.on('data', (data: Buffer) => {
            onData(data.toString());
          });

          port.on('error', (error) => {
            console.error(`[SerialServer] 포트 에러 (${path}):`, error.message);
          });

          resolve(true);
        }
      });
    });
  }

  /**
   * 시리얼 포트를 닫습니다.
   */
  public async closePort(path: string): Promise<boolean> {
    const port = this.ports.get(path);
    if (!port) return false;

    return new Promise((resolve) => {
      port.close((err) => {
        if (err) {
          console.error(`[SerialServer] 포트 닫기 실패 (${path}):`, err.message);
          resolve(false);
        } else {
          this.ports.delete(path);
          console.log(`[SerialServer] 포트 닫힘: ${path}`);
          resolve(true);
        }
      });
    });
  }

  /**
   * 데이터를 전송합니다.
   */
  public async write(path: string, data: string): Promise<boolean> {
    const port = this.ports.get(path);
    if (!port || !port.isOpen) return false;

    return new Promise((resolve) => {
      port.write(data, (err) => {
        if (err) {
          console.error(`[SerialServer] 데이터 쓰기 에러 (${path}):`, err.message);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}
