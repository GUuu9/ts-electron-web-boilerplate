import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { LLMServer } from './llm.server.js';
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
  private fileServer: FileServer;
  private orchestrator: AgentOrchestrator;
  private sessionManager: LLMSessionManager;

  constructor() {
    this.server = new LLMServer();
    this.fileServer = new FileServer();
    this.orchestrator = new AgentOrchestrator(this.fileServer);
    this.sessionManager = new LLMSessionManager(new PersistenceServer());

    // LLM 서버에 에이전트 오케스트레이터 주입
    this.server.setOrchestrator(this.orchestrator);
  }

  public async init() {
    console.log('[LLM] LLM Feature 초기화');
    // 로컬 node-llama-cpp는 별도 백그라운드 서버 프로세스 실행 없이 요청 시 loadModel()을 진행합니다.
  }

  public async shutdown() {
    console.log('[LLM] LLM Feature 종료');
  }

  setupHandlers(mainWindow: BrowserWindow | null): void {
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
        const success = await this.server.loadModel(modelName, n_ctx || 2048);
        if (mainWindow) {
          mainWindow.webContents.send('llm:server-status', success ? 'ready' : 'stopped', modelName);
        }
        return { success };
      } catch (err: any) {
        console.error('[LLM] selectModel error:', err);
        return { success: false, error: err.message };
      }
    });

    ipcMain.handle('llm:getActiveModel', async () => {
      // LLMServer의 현재 모델 명 전달
      return (this.server as any).currentModelName || null;
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
