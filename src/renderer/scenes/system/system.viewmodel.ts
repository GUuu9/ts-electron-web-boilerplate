import { SystemSceneService } from './systemTest.service.js';

/**
 * System ViewModel
 */
export class SystemViewModel {
  constructor(private readonly service: SystemSceneService) {}

  /**
   * 시스템 상태 정보를 가져옵니다.
   */
  public async getSystemStatus() {
    try {
      return await this.service.getStatus();
    } catch (error) {
      console.error('[SystemViewModel] Failed to get status:', error);
      return null;
    }
  }
}
