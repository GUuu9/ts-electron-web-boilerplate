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
    // 1. 이미지 조건 확인 (Vision)
    if (action. condition?.type === 'IMAGE_MATCH') {
      await this.logger.log('INFO', `이미지 확인 중: ${action.condition.targetImage}`);
      // 실제 구현: const match = await this.vision.findImage(action.condition.targetImage);
    }

    // 2. 액션 실행 (Automation)
    try {
      switch (action.type) {
        case 'CLICK':
          if (action.params.x !== undefined && action.params.y !== undefined) {
            await this.automation.moveMouse(action.params.x, action.params.y);
          }
          await this.automation.clickMouse('left', action.params.durationMs);
          break;
        
        case 'KEY_INPUT':
          if (action.params.text) {
            await this.automation.typeText(action.params.text);
          } else if (action.params.key) {
            await this.automation.pressKey(action.params.key, action.params.durationMs);
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

  public async saveMacro(sequence: MacroSequence): Promise<void> {
    try {
      // 파일 저장 경로를 직접 지정하거나 대화상자를 띄울 수 있음 (예시로 지정 경로)
      const path = `macro_${sequence.id}.json`;
      await this.file.write(path, JSON.stringify(sequence, null, 2));
      await this.logger.log('INFO', `매크로 파일 저장 성공: ${path}`);
    } catch (e) {
      await this.logger.log('ERROR', `매크로 파일 저장 실패: ${e}`);
      throw e;
    }
  }

  public async loadMacro(path?: string): Promise<MacroSequence | null> {
    try {
      const filePath = path || await this.file.openDialog();
      if (!filePath) return null;

      const content = await this.file.read(filePath);
      return JSON.parse(content) as MacroSequence;
    } catch (e) {
      await this.logger.log('ERROR', `매크로 파일 로드 실패: ${e}`);
      throw e;
    }
  }
}

