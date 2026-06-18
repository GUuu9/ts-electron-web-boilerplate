import { PersistenceServer } from '../persistence/persistence.server.js';
import { LLMSession, LLMSessionMetadata } from '../../../shared/llm/models.js';
import crypto from 'crypto';

/**
 * LLMSessionManager: 대화 세션의 생성, 조회, 수정, 삭제를 관리합니다.
 */
export class LLMSessionManager {
  private readonly SESSION_LIST_KEY = 'llm_session_list';
  private readonly SESSION_PREFIX = 'llm_session_';

  constructor(private persistence: PersistenceServer) {}

  /**
   * 모든 세션의 메타데이터 목록을 가져옵니다.
   */
  public async getSessions(): Promise<LLMSessionMetadata[]> {
    const list = await this.persistence.load(this.SESSION_LIST_KEY);
    return list || [];
  }

  /**
   * 새로운 세션을 생성합니다.
   */
  public async createSession(model: string, systemPrompt?: string): Promise<LLMSession> {
    const id = crypto.randomUUID();
    const now = Date.now();
    
    const newSession: LLMSession = {
      id,
      title: '새로운 대화',
      model,
      messages: [],
      context: [],
      systemPrompt,
      createdAt: now,
      updatedAt: now
    };

    await this.saveSession(newSession);
    await this.updateSessionList(newSession, 'add');
    
    return newSession;
  }

  /**
   * 특정 세션을 로드합니다.
   */
  public async loadSession(id: string): Promise<LLMSession | null> {
    return await this.persistence.load(this.SESSION_PREFIX + id);
  }

  /**
   * 세션 데이터를 저장(업데이트)합니다.
   */
  public async saveSession(session: LLMSession): Promise<void> {
    session.updatedAt = Date.now();
    await this.persistence.save(this.SESSION_PREFIX + session.id, session);
    await this.updateSessionList(session, 'update');
  }

  /**
   * 세션을 삭제합니다.
   */
  public async deleteSession(id: string): Promise<void> {
    // 실제 데이터 삭제는 PersistenceServer에 삭제 기능이 없으면 null 저장으로 대체 가능
    // (여기서는 null 저장으로 처리하거나 store.delete를 PersistenceServer에 추가해야 함)
    await this.persistence.save(this.SESSION_PREFIX + id, null);
    await this.updateSessionList({ id } as any, 'delete');
  }

  /**
   * 세션 목록(메타데이터)을 동기화합니다.
   */
  private async updateSessionList(session: LLMSession, action: 'add' | 'update' | 'delete'): Promise<void> {
    let list = await this.getSessions();

    if (action === 'delete') {
      list = list.filter(s => s.id !== session.id);
    } else {
      const index = list.findIndex(s => s.id === session.id);
      const metadata: LLMSessionMetadata = {
        id: session.id,
        title: session.title,
        model: session.model,
        updatedAt: session.updatedAt
      };

      if (index > -1) {
        list[index] = metadata;
      } else {
        list.unshift(metadata); // 최신 세션이 위로 오도록
      }
    }

    await this.persistence.save(this.SESSION_LIST_KEY, list);
  }
}
