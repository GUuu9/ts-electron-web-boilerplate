import { OsRepository } from '../../data/os/os.repository.js';

/**
 * OsViewModel (ViewModel)
 */
export class OsViewModel {
  constructor(private readonly repository: OsRepository) {}

  public async sendNotification(title: string, body: string): Promise<void> {
    await this.repository.notify(title, body);
  }
}
