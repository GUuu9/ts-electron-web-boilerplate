import { desktopCapturer, nativeImage } from 'electron';
import { screen } from "@nut-tree-fork/nut-js";

/**
 * Vision Server: 화면 캡처 및 이미지 처리 서비스
 */
export class VisionServer {
  constructor() {}

  /**
   * 화면 전체를 캡처하여 Base64로 반환합니다.
   */
  public async captureScreen(): Promise<string> {
    const primaryScreen = await screen.primary();
    const region = await primaryScreen.getRegion();
    
    // nut.js의 화면 캡처 기능을 사용
    const grabbed = await screen.grabRegion(region);
    
    // nut.js 이미지를 nativeImage로 변환하여 Data URL 생성
    // (간략화된 예시, 실제 환경에 맞춘 변환 로직이 추가될 수 있음)
    const png = await grabbed.toPng();
    return `data:image/png;base64,${png.toString('base64')}`;
  }
}
