import { HttpClient } from '../../../../shared/http-client/http.client.js';

/**
 * HttpRepository (Data Layer)
 */
export class HttpRepository {
  constructor(private readonly httpClient: HttpClient) {}

  public async fetchRemoteData<T>(url: string): Promise<T> {
    const response = await this.httpClient.get<T>(url);
    return response.data;
  }
}
