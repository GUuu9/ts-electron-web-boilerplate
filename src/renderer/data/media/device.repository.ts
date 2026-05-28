/**
 * Device Repository (Data Layer)
 * Electron의 특수한 장치(BT, USB, HID) 선택 이벤트를 관리합니다.
 */
export class DeviceRepository {
  private get media() {
    if (!(window as any).electronAPI?.media) {
      throw new Error('[DeviceRepository] Media API not available.');
    }
    return (window as any).electronAPI.media;
  }

  public selectBt(id: string) { try { this.media.selectBt(id); } catch(e) { console.warn(e); } }
  public selectUsb(id: string) { try { this.media.selectUsb(id); } catch(e) { console.warn(e); } }
  public selectHid(id: string) { try { this.media.selectHid(id); } catch(e) { console.warn(e); } }
  public cancelSelect() { try { this.media.cancelSelect(); } catch(e) { console.warn(e); } }

  public onBtList(callback: (list: any[]) => void) {
    if (!(window as any).electronAPI?.media) return () => {};
    return (window as any).electronAPI.media.onBtList((_: any, list: any[]) => callback(list));
  }
  public onUsbList(callback: (list: any[]) => void) {
    if (!(window as any).electronAPI?.media) return () => {};
    return (window as any).electronAPI.media.onUsbList((_: any, list: any[]) => callback(list));
  }
  public onHidList(callback: (list: any[]) => void) {
    if (!(window as any).electronAPI?.media) return () => {};
    return (window as any).electronAPI.media.onHidList((_: any, list: any[]) => callback(list));
  }
}
