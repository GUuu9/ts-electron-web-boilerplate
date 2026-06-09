import { HttpRepository } from '../../../../data/ipc/network/http/http.repository.js';

export class HttpService {
  constructor(private repository: HttpRepository) {}

  public async fetchRemoteData<T>(url: string): Promise<T> {
    return await this.repository.fetchRemoteData<T>(url);
  }
}
