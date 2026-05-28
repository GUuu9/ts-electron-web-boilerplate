/**
 * TcpRepository (Data Layer)
 * 렌더러가 IPC 브릿지를 통해 백엔드의 TCP 기능에 접근하도록 함
 */
export class TcpRepository {
  public async listen(port: number): Promise<any> {
    // preload.ts의 tcpBridge 구조와 일치하도록 수정: electronAPI.tcp.listen
    return (window as any).electronAPI.tcp.listen(port);
  }
}
