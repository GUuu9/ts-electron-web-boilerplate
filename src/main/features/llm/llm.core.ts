import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { LLMServer } from './llm.server.js';
import { LLMServerManager } from './llm.manager.js';

/**
 * LLMCore: 백엔드 모듈 구현 및 IPC 핸들러 등록
 */
export class LLMCore implements BackendModule {
  private server: LLMServer;
  private manager: LLMServerManager;

  constructor() {
    this.server = new LLMServer();
    this.manager = new LLMServerManager();
  }

  public async init() {
    console.log('[LLM] LLM Feature 초기화');
    // 앱 시작 시 models/ 폴더에 GGUF가 있으면 자동 구동 시도
    const success = await this.manager.start();
    if (success) {
      console.log('[LLM] 초기 llama-server 구동 완료.');
    } else {
      console.log('[LLM] 초기 구동 생략 (모델 없음 또는 바이너리 미설치).');
    }
  }

  public async shutdown() {
    console.log('[LLM] LLM Feature 종료 중...');
    await this.manager.stop();
  }

  setupHandlers(mainWindow: BrowserWindow | null): void {
    ipcMain.handle('llm:getModels', async () => {
      return await this.server.getModels();
    });

    ipcMain.handle('llm:generate', async (_, model: string, prompt: string, system?: string) => {
      return await this.server.generate(model, prompt, system);
    });

    ipcMain.handle('llm:pullModel', async (event, modelName: string) => {
      return await this.server.pullModel(modelName, (message) => {
        event.sender.send('llm:pull-progress', message);
      });
    });

    ipcMain.handle('llm:removeModel', async (_, modelName: string) => {
      return await this.server.removeModel(modelName);
    });

    ipcMain.handle('llm:selectModel', async (_, modelName: string) => {
      try {
        const success = await this.manager.restartWithModel(modelName);
        return { success };
      } catch (err: any) {
        console.error('[LLM] selectModel error:', err);
        return { success: false, error: err.message };
      }
    });

    ipcMain.handle('llm:getActiveModel', async () => {
      return this.manager.getActiveModel();
    });
  }
}
