import { TcpRepository } from '../../../data/network/tcp/tcp.repository.js';

/**
 * TcpViewModel (ViewModel)
 */
export class TcpViewModel {
  constructor(private readonly repository: TcpRepository) {}

  public async startServer(port: number): Promise<void> {
    await this.repository.listen(port);
  }
}
