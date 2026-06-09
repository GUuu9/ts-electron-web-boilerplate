import { PersistenceSceneService } from './persistenceTest.service.js';

/**
 * Persistence ViewModel
 */
export class PersistenceViewModel {
  constructor(private readonly service: PersistenceSceneService) {}

  public async saveData(key: string, value: any) {
    try {
      return await this.service.save(key, value);
    } catch (e) {
      console.error('PersistenceViewModel save 오류:', e);
      return null;
    }
  }

  public async loadData(key: string) {
    try {
      return await this.service.load(key);
    } catch (e) {
      console.error('PersistenceViewModel load 오류:', e);
      return null;
    }
  }
}
