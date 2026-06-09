import { HttpRepository } from '../../../data/network/http/http.repository.js';

/**
 * HttpViewModel (ViewModel)
 */
export class HttpViewModel {
  constructor(private readonly repository: HttpRepository) {}

  public async fetchData(url: string): Promise<any> {
    try {
      return await this.repository.fetchRemoteData(url);
    } catch (error) {
      console.error('[HttpViewModel] Fetch error:', error);
      throw error;
    }
  }
}
