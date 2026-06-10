import { AutomationService } from '../../domains/automation/services/automation.service.js';
import { VisionService } from '../../domains/vision/services/vision.service.js';
import { FileService } from '../../domains/file/services/file.service.js';
import { LoggerService } from '../../domains/logger/services/logger.service.js';
import { MacroSequence, MacroAction } from './macro.models.js';

export class MacroSceneService {
  constructor(
    private automation: AutomationService,
    private vision: VisionService,
    private file: FileService,
    private logger: LoggerService
  ) {}

  public async executeAction(action: MacroAction): Promise<void> {


    // 1. 액션 실행 (Automation)
    try {
      switch (action.type) {
        case 'CLICK':
          if (action.params.x !== undefined && action.params.y !== undefined) {
            await this.automation.moveMouse(action.params.x, action.params.y);
          }
          await this.automation.clickMouse('left', action.params.durationMs);
          break;

        case 'RIGHT_CLICK':
          if (action.params.x !== undefined && action.params.y !== undefined) {
            await this.automation.moveMouse(action.params.x, action.params.y);
          }
          await this.automation.clickMouse('right', action.params.durationMs);
          break;

        case 'DOUBLE_CLICK':
          if (action.params.x !== undefined && action.params.y !== undefined) {
            await this.automation.moveMouse(action.params.x, action.params.y);
          }
          await this.automation.doubleClickMouse();
          break;

        case 'MOVE':
          if (action.params.x !== undefined && action.params.y !== undefined) {
            await this.automation.moveMouse(action.params.x, action.params.y);
          }
          break;

        case 'DRAG':
          if (action.params.x !== undefined && action.params.y !== undefined &&
              action.params.toX !== undefined && action.params.toY !== undefined) {
            await this.automation.dragMouse(action.params.x, action.params.y, action.params.toX, action.params.toY);
          }
          break;

        case 'SCROLL':
          if (action.params.scrollAmount !== undefined) {
            await this.automation.scrollMouse(action.params.scrollAmount);
          }
          break;
        
        case 'KEY_INPUT':
          if (action.params.text) {
            await this.automation.typeText(action.params.text);
          }
          break;

        case 'KEY_PRESS':
          if (action.params.key) {
            await this.automation.pressKey(action.params.key, action.params.durationMs);
          }
          break;

        case 'IMAGE_SEARCH':
          if (action.params.targetImage) {
            const timeout = action.params.timeoutMs || 5000;
            const similarity = action.params.similarity || 0.8;
            const startTime = Date.now();
            let lastResult = { found: false, confidence: 0};

            await this.logger.log('INFO', `이미지 검색 시작: ${action.params.targetImage} (임계값: ${similarity})`);
            
            while (Date.now() - startTime < timeout) {
              lastResult = await this.vision.findImage(action.params.targetImage, similarity);
              if (lastResult.found) break;
              await new Promise(r => setTimeout(r, 500));
            }

            if (lastResult.found && lastResult.x !== undefined && lastResult.y !== undefined) {
              await this.logger.log('INFO', `이미지 발견! 유사도: ${lastResult.confidence.toFixed(2)}, 좌표: ${lastResult.x}, ${lastResult.y}`);
              // 성공 시 동작 수행
              if (action.params.actionOnSuccess === 'CLICK') {
                await this.automation.moveMouse(lastResult.x, lastResult.y);
                await this.automation.clickMouse('left');
              } else if (action.params.actionOnSuccess === 'DOUBLE_CLICK') {
                await this.automation.moveMouse(lastResult.x, lastResult.y);
                await this.automation.doubleClickMouse();
              } else if (action.params.actionOnSuccess === 'MOVE') {
                await this.automation.moveMouse(lastResult.x, lastResult.y);
              }
            } else {
              await this.logger.log('INFO', `이미지 검색 실패 (최고 유사도: ${lastResult.confidence.toFixed(2)})`);
              // 실패 시 동작 수행
              if (action.params.actionOnFailure === 'STOP') {
                throw new Error(`이미지 검색 실패로 인해 매크로 중단: ${action.params.targetImage} (Confidence: ${lastResult.confidence.toFixed(2)})`);
              }
            }
          }
          break;
          
        case 'WAIT':
          await new Promise(r => setTimeout(r, action.params.durationMs || 1000));
          break;
      }
      await this.logger.log('INFO', `액션 실행 완료: ${action.type}`);
    } catch (e) {
      await this.logger.log('ERROR', `액션 실행 실패: ${e}`);
      throw e;
    }
  }

  public async getMousePosition() {
    return await this.automation.getMousePosition();
  }

  public async saveMacro(sequence: MacroSequence): Promise<void> {
    try {
      const filePath = await this.file.saveDialog();
      if (!filePath) return;

      await this.file.write(filePath, JSON.stringify(sequence, null, 2));
      await this.logger.log('INFO', `매크로 파일 저장 성공: ${filePath}`);
    } catch (e) {
      await this.logger.log('ERROR', `매크로 파일 저장 실패: ${e}`);
      throw e;
    }
  }

  public async loadMacro(): Promise<MacroSequence | null> {
    try {
      const filePath = await this.file.openDialog();
      if (!filePath) return null;

      const content = await this.file.read(filePath);
      const sequence = JSON.parse(content) as MacroSequence;
      await this.logger.log('INFO', `매크로 파일 로드 성공: ${filePath}`);
      return sequence;
    } catch (e) {
      await this.logger.log('ERROR', `매크로 파일 로드 실패: ${e}`);
      throw e;
    }
  }
}

