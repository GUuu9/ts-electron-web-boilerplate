/**
 * System Repository
 * 렌더러에서 백엔드의 시스템 정보 API를 호출합니다.
 */
export class SystemRepository {
  public async getStatus(): Promise<any> {
    if (!(window as any).electronAPI?.system) {
      console.warn('[SystemRepository] System API not available.');
      return null;
    }
    return await (window as any).electronAPI.system.getStatus();
  }
}
