import { container } from '../../../../core/di/container.renderer.js';
import type { MediaService } from '../../../../core/device/media.service.js';
import type { UILoggerService } from '../../core/ui-logger.service.js';

export class MediaController {
  private activeStream: MediaStream | null = null;
  private audioInterval: any = null;

  constructor(private readonly logger: UILoggerService) {}

  public async enumerateDevices() {
    const media = container.get<MediaService>('MediaService');
    // 임시 스트림을 열어 권한을 획득해야 라벨이 보임
    const tempStream = await media.getAudioStream();
    if (tempStream) media.stopStream(tempStream);
    return await media.enumerateDevices();
  }

  public async startCameraTest(deviceId: string, label: string, onReady: (stream: MediaStream) => void) {
    this.logger.log(`[Media] Camera Test: ${label}`);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId } });
      onReady(stream);
      
      setTimeout(() => {
        stream.getTracks().forEach(t => t.stop());
        this.logger.log(`[Media] Camera test ended.`);
      }, 5000);
    } catch (e: any) {
      this.logger.log(`Camera Test Error: ${e.message}`, true);
    }
  }

  public async startSpeakerTest(deviceId: string, label: string) {
    this.logger.log(`[Media] Speaker Test (Beep): ${label}`);
    try {
      const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3');
      if ((audio as any).setSinkId) await (audio as any).setSinkId(deviceId);
      audio.play();
      this.logger.log(`[Media] Playing test sound to: ${label}`);
    } catch (e: any) {
      this.logger.log(`Speaker Test Error: ${e.message}`, true);
    }
  }

  public async startMicrophoneTest(deviceId: string, label: string) {
    this.stopMicrophoneTest();
    this.logger.log(`[Media] Mic Test: ${label}`);
    try {
      const stream = await container.get<MediaService>('MediaService').getAudioStream(deviceId);
      if (!stream) return;
      this.activeStream = stream;
      
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      audioContext.createMediaStreamSource(stream).connect(analyser);
      analyser.fftSize = 64;
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      this.audioInterval = setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        if (average > 2) console.log(`[Mic Level] ${'█'.repeat(Math.round(average / 5))}`);
      }, 100);

      setTimeout(() => this.stopMicrophoneTest(), 5000);
    } catch (err: any) {
      this.logger.log(`Mic Test Error: ${err.message}`, true);
    }
  }

  public stopMicrophoneTest() {
    if (this.audioInterval) clearInterval(this.audioInterval);
    if (this.activeStream) {
      container.get<MediaService>('MediaService').stopStream(this.activeStream);
      this.activeStream = null;
      this.logger.log(`[Media] Mic test ended.`);
    }
  }
}
