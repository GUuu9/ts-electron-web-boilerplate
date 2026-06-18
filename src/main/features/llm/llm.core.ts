import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { LLMServer } from './llm.server.js';
import { LLMServerManager } from './llm.manager.js';
import { FileServer } from '../file/file.server.js';
import { AgentOrchestrator } from './agent.orchestrator.js';
import { LLMSessionManager } from './llm.session.js';
import { PersistenceServer } from '../persistence/persistence.server.js';
import { LLMSession } from '../../../shared/llm/models.js';

/**
 * LLMCore: 백엔드 모듈 구현 및 IPC 핸들러 등록
 */
export class LLMCore implements BackendModule {
  private server: LLMServer;
  private manager: LLMServerManager;
  private fileServer: FileServer;
  private orchestrator: AgentOrchestrator;
  private sessionManager: LLMSessionManager;

  constructor() {
    this.server = new LLMServer();
    this.manager = new LLMServerManager();
    this.fileServer = new FileServer();
    this.orchestrator = new AgentOrchestrator(this.fileServer);
    this.sessionManager = new LLMSessionManager(new PersistenceServer());

    // LLM 서버에 에이전트 오케스트레이터 주입
    this.server.setOrchestrator(this.orchestrator);
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
    // LLM 서버 상태 업데이트를 렌더러로 전달
    this.manager.setStatusCallback((status, modelName) => {
      if (mainWindow) {
        mainWindow.webContents.send('llm:server-status', status, modelName);
      }
    });

    // 에이전트 상태 업데이트를 렌더러로 전달
    this.orchestrator.setStatusCallback((status: string) => {
      if (mainWindow) {
        mainWindow.webContents.send('llm:agent-status', status);
      }
    });

    // 텍스트 청크를 렌더러로 실시간 전송
    this.server.setOnChunk((chunk: string) => {
      if (mainWindow) {
        mainWindow.webContents.send('llm:generate-chunk', chunk);
      }
    });

    ipcMain.handle('llm:getModels', async () => {
      return await this.server.getModels();
    });

    ipcMain.handle('llm:generate', async (_, model: string, prompt: string, system?: string) => {
      const response = await this.server.generate(model, prompt, system);
      // 세션 자동 저장 (세션이 활성화된 경우)
      if (this.server.getActiveSession()) {
        await this.sessionManager.saveSession(this.server.getActiveSession()!);
      }
      return response;
    });

    ipcMain.handle('llm:abort-generate', async () => {
      this.server.abortGeneration();
    });

    ipcMain.handle('llm:pullModel', async (event, modelName: string) => {
      return await this.server.pullModel(modelName, (message) => {
        event.sender.send('llm:pull-progress', message);
      });
    });

    ipcMain.handle('llm:removeModel', async (_, modelName: string) => {
      return await this.server.removeModel(modelName);
    });

    ipcMain.handle('llm:selectModel', async (_, modelName: string, n_ctx?: number) => {
      try {
        const success = await this.manager.restartWithModel(modelName, n_ctx);
        return { success };
      } catch (err: any) {
        console.error('[LLM] selectModel error:', err);
        return { success: false, error: err.message };
      }
    });

    ipcMain.handle('llm:getActiveModel', async () => {
      return this.manager.getActiveModel();
    });

    ipcMain.handle('llm:addAllowedPath', async (_, targetPath: string) => {
      this.orchestrator.addAllowedPath(targetPath);
      return { success: true };
    });

    ipcMain.handle('llm:reset-context', async () => {
      this.server.resetContext();
      return { success: true };
    });

    // --- 세션 관리 IPC 핸들러 ---
    ipcMain.handle('llm:getSessions', async () => {
      return await this.sessionManager.getSessions();
    });

    ipcMain.handle('llm:createSession', async (_, model: string, systemPrompt?: string) => {
      const session = await this.sessionManager.createSession(model, systemPrompt);
      this.server.setSession(session);
      return session;
    });

    ipcMain.handle('llm:loadSession', async (_, id: string) => {
      const session = await this.sessionManager.loadSession(id);
      if (session) {
        this.server.setSession(session);
      }
      return session;
    });

    ipcMain.handle('llm:saveSession', async (_, session: LLMSession) => {
      await this.sessionManager.saveSession(session);
      return { success: true };
    });

    ipcMain.handle('llm:deleteSession', async (_, id: string) => {
      await this.sessionManager.deleteSession(id);
      return { success: true };
    });
  }
}
