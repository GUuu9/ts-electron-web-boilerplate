import { UdpRepository } from '../../../data/network/udp/udp.repository.js';

/**
 * UdpViewModel (ViewModel)
 */
export class UdpViewModel {
  private onLogCallback: (msg: string) => void = () => {};

  constructor(private readonly repository: UdpRepository) {
    this.repository.onData(({ msg, rinfo }) => {
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
    await this.repository.bind(port);
    this.log(`[UDP] Bound to port ${port}`);
  }

  public async send(msg: string, port: number, address: string): Promise<void> {
    await this.repository.send(msg, port, address);
    this.log(`[UDP Sent] To ${address}:${port}: ${msg}`);
  }

  public async close(): Promise<void> {
    await this.repository.close();
    this.log(`[UDP] Socket closed`);
  }
}
