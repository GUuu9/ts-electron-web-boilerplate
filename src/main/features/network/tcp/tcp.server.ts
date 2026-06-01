import * as net from 'net';

/**
 * TcpService (Backend Service)
 * 실제 OS 자원을 제어하는 TCP 서버 및 클라이언트 로직
 */
export class TcpService {
  private server: net.Server | null = null;
  private serverSockets: Map<string, net.Socket> = new Map();
  private clientSocket: net.Socket | null = null;

  // --- Server Logic ---
  public startServer(port: number, 
    onConnected: (clientId: string) => void,
    onDisconnected: (clientId: string) => void,
    onData: (clientId: string, data: string) => void
  ) {
    if (this.server) return;

    this.server = net.createServer((socket) => {
      const clientId = `${socket.remoteAddress}:${socket.remotePort}`;
      this.serverSockets.set(clientId, socket);
      onConnected(clientId);

      socket.on('data', (data) => {
        onData(clientId, data.toString());
      });

      socket.on('close', () => {
        this.serverSockets.delete(clientId);
        onDisconnected(clientId);
      });

      socket.on('error', (err) => {
        console.error(`[TCP Server] Socket error (${clientId}):`, err);
      });
    });

    this.server.listen(port, () => {
      console.log(`[TCP Server] Listening on port ${port}`);
    });
  }

  public stopServer() {
    this.serverSockets.forEach(socket => socket.destroy());
    this.serverSockets.clear();
    this.server?.close();
    this.server = null;
    console.log('[TCP Server] Stopped');
  }

  public serverSend(clientId: string, data: string) {
    const socket = this.serverSockets.get(clientId);
    if (socket) {
      socket.write(data);
    }
  }

  public serverBroadcast(data: string) {
    this.serverSockets.forEach(socket => socket.write(data));
  }

  // --- Client Logic ---
  public connect(host: string, port: number,
    onConnected: () => void,
    onDisconnected: () => void,
    onData: (data: string) => void
  ) {
    if (this.clientSocket) return;

    this.clientSocket = new net.Socket();
    
    this.clientSocket.connect(port, host, () => {
      onConnected();
    });

    this.clientSocket.on('data', (data) => {
      onData(data.toString());
    });

    this.clientSocket.on('close', () => {
      this.clientSocket = null;
      onDisconnected();
    });

    this.clientSocket.on('error', (err) => {
      console.error('[TCP Client] Error:', err);
    });
  }

  public disconnect() {
    this.clientSocket?.destroy();
    this.clientSocket = null;
  }

  public clientSend(data: string) {
    this.clientSocket?.write(data);
  }
}
