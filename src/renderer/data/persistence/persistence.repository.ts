/**
 * Persistence Repository
 */
export class PersistenceRepository {
  public async save(key: string, value: any): Promise<void> {
    if (!(window as any).electronAPI?.persistence) {
      console.warn('[PersistenceRepository] Persistence API not available.');
      return;
    }
    await (window as any).electronAPI.persistence.save(key, value);
  }

  public async load(key: string): Promise<any> {
    if (!(window as any).electronAPI?.persistence) {
      console.warn('[PersistenceRepository] Persistence API not available.');
      return null;
    }
    return await (window as any).electronAPI.persistence.load(key);
  }
}
