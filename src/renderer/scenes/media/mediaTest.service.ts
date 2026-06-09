import { MediaService } from '../../domains/media/services/media.service.js';
import { DeviceService } from '../../domains/media/services/device.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

export class MediaSceneService {
  constructor(
    private mediaService: MediaService,
    private deviceService: DeviceService,
    private loggerService: LoggerService
  ) {}

  public async getMediaDevices() {
    await this.loggerService.log('INFO', '미디어 장치 목록 가져오기 시도');
    try {
      const devices = await this.mediaService.enumerateDevices();
      return {
        audioIn: devices.filter(d => d.kind === 'audioinput'),
        audioOut: devices.filter(d => d.kind === 'audiooutput'),
        videoIn: devices.filter(d => d.kind === 'videoinput')
      };
    } catch (error) {
      await this.loggerService.log('ERROR', `미디어 장치 목록 가져오기 실패: ${error}`);
      throw error;
    }
  }

  public getGamepads() {
    return this.mediaService.getGamepads().filter(g => g !== null) as Gamepad[];
  }

  public subscribeBtList(callback: (list: any[]) => void) { return this.deviceService.onBtList(callback); }
  public subscribeUsbList(callback: (list: any[]) => void) { return this.deviceService.onUsbList(callback); }
  public subscribeHidList(callback: (list: any[]) => void) { return this.deviceService.onHidList(callback); }

  public async selectBt(id: string) {
    await this.loggerService.log('INFO', `BT 장치 선택: ${id}`);
    try { this.deviceService.selectBt(id); } catch (e) { await this.loggerService.log('ERROR', `BT 선택 실패: ${e}`); throw e; }
  }
  public async selectUsb(id: string) {
    await this.loggerService.log('INFO', `USB 장치 선택: ${id}`);
    try { this.deviceService.selectUsb(id); } catch (e) { await this.loggerService.log('ERROR', `USB 선택 실패: ${e}`); throw e; }
  }
  public async selectHid(id: string) {
    await this.loggerService.log('INFO', `HID 장치 선택: ${id}`);
    try { this.deviceService.selectHid(id); } catch (e) { await this.loggerService.log('ERROR', `HID 선택 실패: ${e}`); throw e; }
  }
  public async cancelSelect() {
    await this.loggerService.log('INFO', '장치 선택 취소');
    try { this.deviceService.cancelSelect(); } catch (e) { await this.loggerService.log('ERROR', `취소 실패: ${e}`); throw e; }
  }
}
