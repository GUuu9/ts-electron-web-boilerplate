import { VisionState } from './vision.state.js';
import { VisionSceneService } from './vision.service.js';

/**
 * Vision ViewModel
 */
export class VisionViewModel {
  public readonly state = new VisionState();

  constructor(private readonly visionSceneService: VisionSceneService) {}

  /**
   * 캡처 및 프로세싱 실행
   */
  public async captureAndProcess() {
    this.state.status = 'Processing...';
    try {
      const base64Image = await this.visionSceneService.captureAndProcess();
      this.state.processedImage = base64Image;
      this.state.status = 'Success';
    } catch (error) {
      console.error('VisionViewModel captureAndProcess 오류:', error);
      this.state.status = 'Error';
    }
  }

  /**
   * 처리된 이미지 저장
   */
  public async saveProcessedImage() {
    if (!this.state.processedImage) {
      this.state.status = '이미지가 없습니다.';
      return;
    }

    try {
      await this.visionSceneService.saveProcessedImage(this.state.processedImage);
    } catch (error) {
      console.error('VisionViewModel saveProcessedImage 오류:', error);
      this.state.status = '저장 실패';
    }
  }

  /**
   * 템플릿 이미지 찾아보기
   */
  public async browseTemplate() {
    try {
      const path = await this.visionSceneService.openFileDialog();
      if (path) {
        this.state.templatePath = path;
      }
    } catch (error) {
      console.error('VisionViewModel browseTemplate 오류:', error);
    }
  }

  /**
   * 이미지 찾기 테스트 실행
   */
  public async testFindImage(showEdge: boolean = false) {
    if (!this.state.templatePath) {
      this.state.status = 'Template path is empty';
      return;
    }

    this.state.status = 'Searching...';
    try {
      const result = await this.visionSceneService.findImage(this.state.templatePath, this.state.similarity, showEdge);
      this.state.matchResult = result;
      if (showEdge && result.processedImage) {
        this.state.processedImage = result.processedImage;
      }
      this.state.status = result.found ? 'Found' : 'Not Found';
    } catch (error) {
      console.error('VisionViewModel testFindImage 오류:', error);
      this.state.status = 'Error';
    }
  }

  /**
   * 부분 캡처
   */
  public async partialCapture() {
    this.state.status = 'Processing...';
    try {
      const base64Image = await this.visionSceneService.partialCapture();
      if (base64Image) {
        this.state.processedImage = base64Image;
        this.state.status = 'Success';
      } else {
        this.state.status = 'Cancelled';
      }
    } catch (error) {
      console.error('VisionViewModel partialCapture 오류:', error);
      this.state.status = 'Error';
    }
  }

  /**
   * 유사도 설정
   */
  public setSimilarity(value: number) {
    this.state.similarity = value;
  }
}
