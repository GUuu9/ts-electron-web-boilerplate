import { HttpService } from '../../../domains/network/http/services/http.service.js';
import { LoggerService } from '../../../domains/logger/services/logger.service.js';

export class HttpSceneService {
  constructor(
    private service: HttpService,
    private loggerService: LoggerService
  ) {}

  public async fetchData(url: string): Promise<any> {
    await this.loggerService.log('INFO', `HTTP 데이터 요청: ${url}`);
    try {
      const data = await this.service.fetchRemoteData(url);
      await this.loggerService.log('INFO', `HTTP 데이터 수신 성공: ${url}`);
      return data;
    } catch (error) {
      await this.loggerService.log('ERROR', `HTTP 데이터 요청 실패: ${url}, ${error}`);
      throw error;
    }
  }
}
