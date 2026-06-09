import { UdpRepository } from '../../../../data/ipc/network/udp/udp.repository.js';

export class UdpService {
  constructor(private repository: UdpRepository) {}

  public get isDesktop(): boolean { return this.repository.isDesktop; }

  public async bind(port: number): Promise<void> { await this.repository.bind(port); }
  public async send(msg: string, port: number, address: string): Promise<void> { await this.repository.send(msg, port, address); }
  public async close(): Promise<void> { await this.repository.close(); }
  public onData(callback: (data: { msg: string, rinfo: any }) => void) { this.repository.onData(callback); }
}
