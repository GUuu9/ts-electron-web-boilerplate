/**
 * UdpRepository (Data Layer)
 */
export class UdpRepository {
  private get udp() { return (window as any).electronAPI.udp; }

  public get isDesktop(): boolean { return !!(window as any).electronAPI?.udp; }

  public async bind(port: number): Promise<void> {
    if (!this.isDesktop) return;
    await this.udp.bind(port);
  }

  public async send(msg: string, port: number, address: string): Promise<void> {
    if (!this.isDesktop) return;
    await this.udp.send({ msg, port, address });
  }

  public async close(): Promise<void> {
    if (!this.isDesktop) return;
    await this.udp.close();
  }

  public onData(callback: (data: { msg: string, rinfo: any }) => void) {
    if (!this.isDesktop) return;
    this.udp.onData(callback);
  }
}
