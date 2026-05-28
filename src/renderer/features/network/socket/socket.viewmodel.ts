import { SocketRepository } from '../../../data/network/socket/socket.repository.js';

/**
 * SocketViewModel (ViewModel)
 */
export class SocketViewModel {
  constructor(private readonly repository: SocketRepository) {}

  public connect(url: string): void {
    this.repository.connect(url);
  }

  public sendMessage(event: string, data: any): void {
    this.repository.send(event, data);
  }
}
