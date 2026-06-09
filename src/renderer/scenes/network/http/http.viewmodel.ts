import { HttpSceneService } from './httpTest.service.js';

/**
 * HttpViewModel (ViewModel)
 */
export class HttpViewModel {
  constructor(private readonly service: HttpSceneService) {}

  public async fetchData(url: string): Promise<any> {
    try {
      return await this.service.fetchData(url);
    } catch (error) {
      console.error('[HttpViewModel] Fetch error:', error);
      // 필요시 UI 에러 상태 처리 추가
      return null;
    }
  }
}
