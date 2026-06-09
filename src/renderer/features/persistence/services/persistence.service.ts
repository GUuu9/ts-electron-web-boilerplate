import { PersistenceRepository } from '../../../data/ipc/persistence/persistence.repository.js';

/**
 * PersistenceService
 * 특정 키(Key)를 기반으로 데이터를 저장하고 불러오는 범용 서비스입니다.
 */
export class PersistenceService {
  constructor(private repository: PersistenceRepository) {}

  public async save<T>(key: string, data: T): Promise<void> {
    await this.repository.save(key, data);
  }

  public async load<T>(key: string): Promise<T | null> {
    return await this.repository.load(key);
  }
}
