import { OsRepository } from '../../../data/ipc/os/os.repository.js';

export class OsService {
  constructor(private repository: OsRepository) {}

  public async notify(title: string, body: string): Promise<void> {
    await this.repository.notify(title, body);
  }
}
