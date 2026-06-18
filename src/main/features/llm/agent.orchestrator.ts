import path from 'path';
import { FileServer } from '../file/file.server.js';
import { AgentAction, AgentObservation } from '../../../shared/llm/models.js';

/**
 * AgentOrchestrator: LLM의 응답을 해석하고 도구를 실행하며, ReAct 루프를 관리합니다.
 */
export class AgentOrchestrator {
  private readonly projectRoot: string;
  private allowedPaths: string[] = [];
  private statusCallback: ((status: string) => void) | null = null;
  private lastAction: string | null = null;

  constructor(private fileServer: FileServer) {
    this.projectRoot = process.cwd();
    this.allowedPaths.push(this.projectRoot);
  }

  /**
   * 마지막으로 수행한 액션을 초기화합니다.
   */
  public resetLastAction() {
    this.lastAction = null;
  }

  /**
   * 중복된 액션인지 확인합니다.
   */
  public isDuplicateAction(action: AgentAction): boolean {
    const currentActionStr = JSON.stringify(action);
    if (this.lastAction === currentActionStr) {
      return true;
    }
    this.lastAction = currentActionStr;
    return false;
  }

  /**
   * 에이전트가 접근할 수 있는 경로를 추가합니다.
   */
  public addAllowedPath(targetPath: string) {
    const resolvedPath = path.resolve(targetPath);
    if (!this.allowedPaths.includes(resolvedPath)) {
      this.allowedPaths.push(resolvedPath);
      console.log(`[Agent] 접근 허용 경로 추가됨: ${resolvedPath}`);
    }
  }

  public setStatusCallback(callback: (status: string) => void) {
    this.statusCallback = callback;
  }

  private notifyStatus(status: string) {
    if (this.statusCallback) {
      this.statusCallback(status);
    }
  }

  /**
   * LLM 응답 텍스트에서 Action을 추출합니다.
   * "Action: { ... }" 형식을 찾습니다.
   */
  public parseAction(text: string): AgentAction | null {
    const actionMatch = text.match(/Action:\s*({[\s\S]*?})/);
    if (!actionMatch) return null;

    try {
      const actionData = JSON.parse(actionMatch[1]);
      return actionData as AgentAction;
    } catch (err) {
      console.error('[Agent] Action 파싱 실패:', err);
      return null;
    }
  }

  /**
   * 추출된 액션을 실행하고 결과를 Observation 형식으로 반환합니다.
   */
  public async executeAction(action: AgentAction): Promise<AgentObservation> {
    try {
      this.notifyStatus(`${action.action} 수행 중: ${action.path}`);

      // 보안을 위한 경로 검증
      const safePath = this.getSafePath(action.path);
      if (!safePath) {
        return { success: false, error: '접근이 허용되지 않는 경로입니다. 먼저 해당 경로의 접근 권한을 요청하세요.' };
      }

      switch (action.action) {
        case 'READ_FILE': {
          const content = await this.fileServer.readFile(safePath);
          return { success: true, data: content.toString() };
        }
        case 'WRITE_FILE': {
          if (action.content === undefined) return { success: false, error: '내용(content)이 없습니다.' };
          await this.fileServer.writeFile(safePath, action.content);
          return { success: true, data: '파일이 성공적으로 저장되었습니다.' };
        }
        case 'LIST_FILES': {
          const files = await this.fileServer.listFiles(safePath);
          return { success: true, data: files.join(', ') };
        }
        case 'DELETE_FILE': {
          await this.fileServer.deleteFile(safePath);
          return { success: true, data: '파일이 성공적으로 삭제되었습니다.' };
        }
        default:
          return { success: false, error: `알 수 없는 액션입니다: ${action.action}` };
      }
    } catch (err: any) {
      console.error(`[Agent] 액션 실행 중 오류 (${action.action}):`, err);
      return { success: false, error: err.message };
    }
  }

  /**
   * 허용된 경로 내에 있는지 검증합니다.
   */
  private getSafePath(targetPath: string): string | null {
    const resolvedPath = path.resolve(targetPath);
    
    // 허용된 경로 목록 중 하나라도 시작 경로가 일치하는지 확인
    for (const allowed of this.allowedPaths) {
      if (resolvedPath.startsWith(allowed)) {
        return resolvedPath;
      }
    }

    // 상대 경로인 경우 프로젝트 루트 기준으로 재시도
    const relResolved = path.resolve(this.projectRoot, targetPath);
    for (const allowed of this.allowedPaths) {
      if (relResolved.startsWith(allowed)) {
        return relResolved;
      }
    }

    return null;
  }

  /**
   * Observation 결과를 LLM에게 전달할 텍스트로 변환합니다.
   */
  public formatObservation(observation: AgentObservation): string {
    if (observation.success) {
      return `Observation: 성공. 결과: ${observation.data}`;
    } else {
      return `Observation: 실패. 원인: ${observation.error}`;
    }
  }

  /**
   * 응답 텍스트에 Final Answer가 포함되어 있는지 확인합니다.
   */
  public isFinalAnswer(text: string): boolean {
    return text.includes('Final Answer:');
  }
}
