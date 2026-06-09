import { SerialSceneService } from './serialTest.service.js';

/**
 * Serial ViewModel
 */
export class SerialViewModel {
  private dataCallback: (() => void) | null = null;

  constructor(private readonly service: SerialSceneService) {}

  public async getPorts() {
    try { return await this.service.getPorts(); } catch(e) { console.error(e); return []; }
  }

  public async connect(path: string, baudRate: number) {
    try { return await this.service.connect(path, baudRate); } catch(e) { console.error(e); return false; }
  }

  public async disconnect(path: string) {
    try { return await this.service.disconnect(path); } catch(e) { console.error(e); return false; }
  }

  public async send(path: string, data: string) {
    try { return await this.service.send(path, data); } catch(e) { console.error(e); return false; }
  }

  public subscribeData(callback: (data: { path: string, data: string }) => void) {
    if (this.dataCallback) this.dataCallback();
    this.dataCallback = this.service.subscribeData(callback);
  }
}
