/**
 * OsRepository (Data Layer)
 */
export class OsRepository {
  public async notify(title: string, body: string): Promise<void> {
    if (!(window as any).electronAPI?.os) {
      console.warn('[OsRepository] OS API not available.');
      return;
    }
    await (window as any).electronAPI.os.notify(title, body);
  }
}
