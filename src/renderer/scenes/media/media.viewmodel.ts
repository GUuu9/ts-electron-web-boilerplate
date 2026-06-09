import { MediaSceneService } from './mediaTest.service.js';

/**
 * Media ViewModel
 */
export class MediaViewModel {
  constructor(private readonly mediaSceneService: MediaSceneService) {}

  public async getMediaDevices() {
    try {
      return await this.mediaSceneService.getMediaDevices();
    } catch (error) {
      console.error('MediaViewModel getMediaDevices 오류:', error);
      return { audioIn: [], audioOut: [], videoIn: [] };
    }
  }

  public getGamepads() {
    return this.mediaSceneService.getGamepads();
  }

  // --- Specialized Device Selection (IPC) ---
  public subscribeBtList(callback: (list: any[]) => void) { return this.mediaSceneService.subscribeBtList(callback); }
  public subscribeUsbList(callback: (list: any[]) => void) { return this.mediaSceneService.subscribeUsbList(callback); }
  public subscribeHidList(callback: (list: any[]) => void) { return this.mediaSceneService.subscribeHidList(callback); }

  public async selectBt(id: string) {
    try { await this.mediaSceneService.selectBt(id); } catch (e) { console.error('MediaViewModel selectBt 오류:', e); }
  }
  public async selectUsb(id: string) {
    try { await this.mediaSceneService.selectUsb(id); } catch (e) { console.error('MediaViewModel selectUsb 오류:', e); }
  }
  public async selectHid(id: string) {
    try { await this.mediaSceneService.selectHid(id); } catch (e) { console.error('MediaViewModel selectHid 오류:', e); }
  }
  public async cancelSelect() {
    try { await this.mediaSceneService.cancelSelect(); } catch (e) { console.error('MediaViewModel cancelSelect 오류:', e); }
  }
}
