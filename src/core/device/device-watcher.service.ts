/**
 * 하드웨어 장치 연결/해제 상태를 실시간으로 모니터링하는 서비스
 */
export class DeviceWatcherService {
  constructor() {
    this.initWatchers();
  }

  private initWatchers() {
    // USB 연결 감지
    if (navigator.usb) {
      navigator.usb.addEventListener('connect', (event) => {
        console.log(`[USB] 장치가 연결되었습니다: ${event.device.productName || 'Unknown Device'}`);
      });
      navigator.usb.addEventListener('disconnect', (event) => {
        console.log(`[USB] 장치가 연결 해제되었습니다: ${event.device.productName || 'Unknown Device'}`);
      });
    }

    // 미디어 장치 변경 감지
    if (navigator.mediaDevices) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        console.log(`[Media] 장치 구성이 변경되었습니다.`);
      });
    }
  }
}
