import { OsSceneService } from './osTest.service.js';

/**
 * OsViewModel (ViewModel)
 */
export class OsViewModel {
  constructor(private readonly service: OsSceneService) {}

  public async sendNotification(title: string, body: string): Promise<void> {
    try {
      await this.service.notify(title, body);
    } catch (e) {
      console.error('OsViewModel notification error:', e);
    }
  }
}
