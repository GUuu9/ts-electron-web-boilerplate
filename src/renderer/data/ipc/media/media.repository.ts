/**
 * Media Repository (Data Layer)
 * 브라우저 표준 MediaDevices API 및 Gamepad API를 사용하여 장치를 제어합니다.
 */
export class MediaRepository {
  /**
   * 오디오/비디오 장치 목록을 가져옵니다.
   */
  public async enumerateDevices(): Promise<MediaDeviceInfo[]> {
    return await navigator.mediaDevices.enumerateDevices();
  }

  /**
   * 카메라/마이크 스트림을 가져옵니다.
   */
  public async getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream> {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  /**
   * 게임 패드 목록을 가져옵니다.
   */
  public getGamepads(): (Gamepad | null)[] {
    return navigator.getGamepads();
  }

  /**
   * 장치 변경 이벤트를 구독합니다.
   */
  public onDeviceChange(callback: () => void): void {
    navigator.mediaDevices.ondevicechange = callback;
  }
}
