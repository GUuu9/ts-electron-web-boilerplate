import { SerialRepository } from '../../../../data/ipc/serial/serial.repository.js';

export class SerialService {
  constructor(private repository: SerialRepository) {}

  public async listPorts(): Promise<any[]> {
    return await this.repository.listPorts();
  }

  public async open(path: string, baudRate: number): Promise<boolean> {
    return await this.repository.open(path, baudRate);
  }

  public async close(path: string): Promise<boolean> {
    return await this.repository.close(path);
  }

  public async write(path: string, data: string): Promise<boolean> {
    return await this.repository.write(path, data);
  }

  public onData(callback: (data: { path: string, data: string }) => void): () => void {
    return this.repository.onData(callback);
  }
}
