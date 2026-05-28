import { UdpRepository } from '../../../data/network/udp/udp.repository.js';

/**
 * UdpViewModel (ViewModel)
 */
export class UdpViewModel {
  constructor(private readonly repository: UdpRepository) {}

  public async bind(port: number): Promise<void> {
    await this.repository.bind(port);
  }

  public async send(msg: string, port: number, address: string): Promise<void> {
    await this.repository.send(msg, port, address);
  }
}
