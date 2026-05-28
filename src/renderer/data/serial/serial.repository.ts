/**
 * Serial Repository (Data Layer)
 */
export class SerialRepository {
  private get serial() {
    if (!(window as any).electronAPI?.serial) {
      throw new Error('[SerialRepository] Electron Serial API not available.');
    }
    return (window as any).electronAPI.serial;
  }

  public async listPorts(): Promise<any[]> {
    try { return await this.serial.listPorts(); } 
    catch (e) { console.warn(e); return []; }
  }

  public async open(path: string, baudRate: number): Promise<boolean> {
    try { return await this.serial.open(path, baudRate); } 
    catch (e) { console.warn(e); return false; }
  }

  public async close(path: string): Promise<boolean> {
    try { return await this.serial.close(path); } 
    catch (e) { console.warn(e); return false; }
  }

  public async write(path: string, data: string): Promise<boolean> {
    try { return await this.serial.write(path, data); } 
    catch (e) { console.warn(e); return false; }
  }

  public onData(callback: (data: { path: string, data: string }) => void): () => void {
    if (!(window as any).electronAPI?.serial) return () => {};
    return (window as any).electronAPI.serial.onData((_: any, data: any) => callback(data));
  }
}
