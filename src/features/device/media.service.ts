/**
 * 오디오(마이크, 헤드셋) 및 미디어 장치 제어 서비스
 * Web MediaDevices API를 활용하여 웹과 데스크탑에서 공용입니다.
 */
export class MediaService {
  /**
   * 사용 가능한 입력/출력 장치 리스트를 가져옵니다.
   */
  public async enumerateDevices(): Promise<MediaDeviceInfo[]> {
    try {
      return await navigator.mediaDevices.enumerateDevices();
    } catch (err) {
      console.error('Enumerate Devices Error:', err);
      return [];
    }
  }

  /**
   * 특정 마이크/오디오 장치로부터 스트림을 가져옵니다.
   */
  public async getAudioStream(deviceId?: string): Promise<MediaStream | null> {
    try {
      const constraints: MediaStreamConstraints = {
        audio: deviceId ? { deviceId: { exact: deviceId } } : true,
        video: false
      };
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (err) {
      console.error('Get Audio Stream Error:', err);
      return null;
    }
  }

  /**
   * 장치 연결/해제 상태를 감지하는 이벤트 리스너를 등록합니다.
   */
  public onDeviceChange(callback: () => void): void {
    navigator.mediaDevices.ondevicechange = callback;
  }

  /**
   * 스트림 사용을 중지하고 자원을 해제합니다.
   */
  public stopStream(stream: MediaStream): void {
    stream.getTracks().forEach(track => track.stop());
  }
}
