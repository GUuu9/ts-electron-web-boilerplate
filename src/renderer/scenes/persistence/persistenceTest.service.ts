import { PersistenceService } from '../../domains/persistence/services/persistence.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class PersistenceSceneService {
  constructor(
    private service: PersistenceService,
    private loggerService: LoggerService
  ) {}

  public async save(key: string, value: any) {
    await this.loggerService.log('INFO', `데이터 저장 시도: ${key}`);
    try {
      await this.service.save(key, value);
      await this.loggerService.log('INFO', `데이터 저장 성공: ${key}`);
    } catch(e) {
      await this.loggerService.log('ERROR', `데이터 저장 실패: ${key}, ${e}`);
      throw e;
    }
  }

  public async load(key: string) {
    await this.loggerService.log('INFO', `데이터 로드 시도: ${key}`);
    try {
      const data = await this.service.load(key);
      await this.loggerService.log('INFO', `데이터 로드 성공: ${key}`);
      return data;
    } catch(e) {
      await this.loggerService.log('ERROR', `데이터 로드 실패: ${key}, ${e}`);
      throw e;
    }
  }
}
