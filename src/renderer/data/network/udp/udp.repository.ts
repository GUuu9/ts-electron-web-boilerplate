/**
 * UdpRepository (Data Layer)
 */
export class UdpRepository {
  public async bind(port: number): Promise<any> {
    return (window as any).electronAPI.udp.bind(port);
  }

  public async send(msg: string, port: number, address: string): Promise<any> {
    return (window as any).electronAPI.udp.send({ msg, port, address });
  }
}
