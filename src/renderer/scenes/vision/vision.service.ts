import { VisionService } from '../../domains/vision/services/vision.service.js';
import { FileService } from '../../domains/file/services/file.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';

/**
 * VisionSceneService
 * Vision Scene의 비즈니스 로직을 처리합니다.
 */
export class VisionSceneService {
  constructor(
    private readonly visionService: VisionService,
    private readonly fileService: FileService,
    private readonly loggerService: LoggerService
  ) {}

  /**
   * 화면을 캡처하고 프로세싱 결과를 반환합니다.
   */
  public async captureAndProcess(): Promise<string> {
    await this.loggerService.log('INFO', 'Vision Scene: 화면 캡처 및 프로세싱 시작');
    try {
      const result = await this.visionService.processScreen();
      await this.loggerService.log('INFO', 'Vision Scene: 프로세싱 완료');
      return result;
    } catch (error) {
      await this.loggerService.log('ERROR', `Vision Scene: 프로세싱 실패 - ${error}`);
      throw error;
    }
  }

  /**
   * 화면의 특정 영역을 캡처하고 엣지를 검출합니다.
   */
  public async partialCapture(): Promise<string | null> {
    await this.loggerService.log('INFO', 'Vision Scene: 부분 캡처 시작');
    try {
      const filePath = await (this.visionService as any).captureRegion(); 
      if (filePath) {
        await this.loggerService.log('INFO', 'Vision Scene: 캡처 완료, 처리 시작');
        const result = await (this.visionService as any).processImageFile(filePath);
        await this.loggerService.log('INFO', 'Vision Scene: 부분 캡처 및 처리 완료');
        return result;
      }
      return null;
    } catch (error) {
      await this.loggerService.log('ERROR', `Vision Scene: 부분 캡처 실패 - ${error}`);
      throw error;
    }
  }

  /**
   * 이미지 템플릿을 찾습니다.
   */
  public async findImage(templatePath: string, similarity: number, showEdge: boolean): Promise<{ found: boolean, x?: number, y?: number, confidence: number, processedImage?: string }> {
    await this.loggerService.log('INFO', `Vision Scene: 이미지 찾기 시작 - ${templatePath} (similarity: ${similarity}, edge: ${showEdge})`);
    try {
      // Assuming the visionService supports these new parameters
      const result = await (this.visionService as any).findImage(templatePath, similarity, showEdge);
      await this.loggerService.log('INFO', `Vision Scene: 이미지 찾기 완료 - 결과: ${result.found}`);
      return result;
    } catch (error) {
      await this.loggerService.log('ERROR', `Vision Scene: 이미지 찾기 실패 - ${error}`);
      throw error;
    }
  }

  /**
   * 처리된 이미지를 파일로 저장합니다.
   */
  public async saveProcessedImage(base64Image: string): Promise<void> {
    await this.loggerService.log('INFO', 'Vision Scene: 이미지 저장 시작');
    try {
      const filePath = await this.fileService.saveDialog([
        { name: 'Images', extensions: ['png'] }
      ], 'processed_image.png');
      
      if (filePath) {
        // Base64 데이터에서 헤더 제거
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        // Uint8Array로 변환 (Browser compatible)
        const binaryString = window.atob(base64Data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        await this.fileService.write(filePath, bytes, null);
        await this.loggerService.log('INFO', `Vision Scene: 이미지 저장 완료 - ${filePath}`);
      }
    } catch (error) {
      await this.loggerService.log('ERROR', `Vision Scene: 이미지 저장 실패 - ${error}`);
      throw error;
    }
  }

  /**
   * 파일 열기 다이얼로그를 표시합니다.
   */
  public async openFileDialog(): Promise<string | null> {
    return await this.fileService.openDialog([
      { name: 'Images', extensions: ['jpg', 'png', 'bmp'] }
    ]);
  }
}
