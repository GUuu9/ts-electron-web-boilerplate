import { SystemRepository } from '../../data/system/system.repository.js';

/**
 * System ViewModel
 */
export class SystemViewModel {
  constructor(private readonly repository: SystemRepository) {}

  /**
   * 시스템 상태 정보를 가져옵니다.
   */
  public async getSystemStatus() {
    try {
      return await this.repository.getStatus();
    } catch (error) {
      console.error('[SystemViewModel] Failed to get status:', error);
      throw error;
    }
  }
}
