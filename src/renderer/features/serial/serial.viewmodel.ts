import { SerialRepository } from '../../data/serial/serial.repository.js';

/**
 * Serial ViewModel
 */
export class SerialViewModel {
  private dataCallback: (() => void) | null = null;

  constructor(private readonly repository: SerialRepository) {}

  public async getPorts() {
    return await this.repository.listPorts();
  }

  public async connect(path: string, baudRate: number) {
    return await this.repository.open(path, baudRate);
  }

  public async disconnect(path: string) {
    return await this.repository.close(path);
  }

  public async send(path: string, data: string) {
    return await this.repository.write(path, data);
  }

  public subscribeData(callback: (data: { path: string, data: string }) => void) {
    if (this.dataCallback) this.dataCallback();
    this.dataCallback = this.repository.onData(callback);
  }
}
