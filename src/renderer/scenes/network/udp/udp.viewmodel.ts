import { UdpSceneService } from './udpTest.service.js';

/**
 * UdpViewModel (ViewModel)
 */
export class UdpViewModel {
  private onLogCallback: (msg: string) => void = () => {};

  constructor(private readonly service: UdpSceneService) {
    this.service.onData(({ msg, rinfo }) => {
      this.log(`[UDP Received] From ${rinfo.address}:${rinfo.port}: ${msg}`);
    });
  }

  public setLogCallback(callback: (msg: string) => void) {
    this.onLogCallback = callback;
  }

  private log(msg: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.onLogCallback(`[${timestamp}] ${msg}`);
  }

  public async bind(port: number): Promise<void> {
    try {
      await this.service.bind(port);
      this.log(`[UDP] Bound to port ${port}`);
    } catch(e) {
      this.log(`[UDP] Bind Error: ${e}`);
    }
  }

  public async send(msg: string, port: number, address: string): Promise<void> {
    try {
      await this.service.send(msg, port, address);
      this.log(`[UDP Sent] To ${address}:${port}: ${msg}`);
    } catch(e) {
      this.log(`[UDP] Send Error: ${e}`);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.service.close();
      this.log(`[UDP] Socket closed`);
    } catch(e) {
      this.log(`[UDP] Close Error: ${e}`);
    }
  }
}
