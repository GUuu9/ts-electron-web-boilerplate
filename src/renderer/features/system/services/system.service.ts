import { SystemRepository } from '../../../../data/ipc/system/system.repository.js';

export class SystemService {
  constructor(private repository: SystemRepository) {}

  public async getStatus(): Promise<any> {
    return await this.repository.getStatus();
  }
}
