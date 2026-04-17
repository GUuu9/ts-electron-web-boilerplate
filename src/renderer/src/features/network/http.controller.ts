import { container } from '../../../../core/di/container.renderer.js';
import type { HttpClient } from '../../../../core/network/http.client.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class HttpController {
  constructor(private readonly logger: UILoggerService) {}

  public async testHttp(url: string): Promise<void> {
    this.logger.log(`[HTTP] GET ${url}`);
    try {
      const http = container.get<HttpClient>('HttpClient');
      const res = await http.get(url);
      this.logger.log(`Status: ${res.status}`);
      this.logger.log(`Data: ${JSON.stringify(res.data).substring(0, 100)}...`);
    } catch (err: any) {
      this.logger.log(`HTTP Error: ${err.message}`, true);
    }
  }
}
