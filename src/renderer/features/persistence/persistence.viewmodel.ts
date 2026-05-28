import { PersistenceRepository } from '../../data/persistence/persistence.repository.js';

/**
 * Persistence ViewModel
 */
export class PersistenceViewModel {
  constructor(private readonly repository: PersistenceRepository) {}

  public async saveData(key: string, value: any) {
    return await this.repository.save(key, value);
  }

  public async loadData(key: string) {
    return await this.repository.load(key);
  }
}
