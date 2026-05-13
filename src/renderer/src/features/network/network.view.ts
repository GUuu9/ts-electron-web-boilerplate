/**
 * NetworkView
 * 역할: 네트워크 인프라(HTTP, Socket.io, TCP, UDP) 관련 UI 템플릿을 생성합니다.
 */
export class NetworkView {
  /**
   * 하위 탭에 맞는 HTML 컨텐츠를 반환합니다.
   */
  public getHtml(subType: string): string {
    switch (subType) {
      case 'http':
        return this.getHttpTemplate();
      case 'socket':
        return this.getSocketTemplate();
      case 'tcp':
        return this.getTcpTemplate();
      case 'udp':
        return this.getUdpTemplate();
      default:
        return '';
    }
  }

  private getHttpTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section" style="background: rgba(255,255,255,0.01);">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
            <i data-lucide="globe" style="color: #60a5fa; width: 20px;"></i>
            <h5 style="margin: 0; color: #60a5fa;">HTTP / REST API Client</h5>
          </div>

          <div class="form-group">
            <label>Target URL</label>
            <input type="text" id="http-url" value="https://jsonplaceholder.typicode.com/todos/1" style="padding: 10px;">
          </div>

          <div class="button-group" style="margin-top: 1.5rem;">
            <button class="primary" style="display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 24px; min-width: 200px;" onclick="window.networkController.testHttp()">
              <i data-lucide="send" style="width: 16px; height: 16px;"></i>
              <span>Send GET Request</span>
            </button>
          </div>
        </div>
      </div>`;
  }

  private getSocketTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <!-- Socket.io Client Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="zap" style="color: var(--secondary); width: 20px;"></i>
              <h5 style="margin: 0; color: var(--secondary);">1. Socket.io Client</h5>
            </div>

            <div class="form-group">
              <label>Server URL</label>
              <input type="text" id="socket-url" value="http://localhost:3000" style="padding: 10px;">
            </div>

            <div class="button-group" style="margin-bottom: 1.5rem;">
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="window.networkController.testSocketConnect()">
                <i data-lucide="link" style="width: 14px; height: 14px;"></i> Connect
              </button>
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #ef4444;" onclick="window.networkController.testSocketDisconnect()">
                <i data-lucide="link-2-off" style="width: 14px; height: 14px;"></i> Disconnect
              </button>
            </div>
            
            <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
              <div class="form-group">
                <label>Event Name</label>
                <input type="text" id="socket-event" value="chat message" style="padding: 10px;">
              </div>
              <div class="form-group">
                <label>Data (JSON/String)</label>
                <textarea id="socket-msg" style="height: 60px; padding: 10px;">{"text": "Hello Server!"}</textarea>
              </div>
              <div class="button-group">
                <button class="primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="window.networkController.testSocketEmit()">
                  <i data-lucide="send" style="width: 14px; height: 14px;"></i> Emit Event
                </button>
              </div>
            </div>

            <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
              <div style="display: grid; grid-template-columns: 1fr 100px; gap: 1rem;">
                <div class="form-group">
                  <label>Listen Event Name</label>
                  <input type="text" id="socket-listen-event" value="response" style="padding: 10px;">
                </div>
                <div class="form-group">
                  <label>Max</label>
                  <input type="number" id="socket-listen-count" value="1" style="padding: 10px;">
                </div>
              </div>
              <div class="button-group">
                <button class="primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: rgba(139, 92, 246, 0.1); border: 1px solid var(--secondary); color: var(--secondary);" onclick="window.networkController.testSocketListen()">
                  <i data-lucide="radio" style="width: 14px; height: 14px;"></i> Start Listening
                </button>
              </div>
            </div>
          </div>

          <!-- Socket.io Server Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="server" style="color: #10b981; width: 20px;"></i>
              <h5 style="margin: 0; color: #10b981;">2. Socket.io Server (Node.js)</h5>
            </div>

            <div class="form-group">
              <label>Listen Port</label>
              <input type="number" id="socket-server-port" value="3000" style="padding: 10px;">
            </div>
            <div class="button-group" style="margin-bottom: 1.5rem;">
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #059669;" onclick="window.networkController.startSocketServer()">
                <i data-lucide="play" style="width: 14px; height: 14px;"></i> Start
              </button>
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #ef4444;" onclick="window.networkController.stopSocketServer()">
                <i data-lucide="square" style="width: 14px; height: 14px;"></i> Stop
              </button>
            </div>

            <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
              <div class="form-group">
                <label>Broadcast Event</label>
                <input type="text" id="socket-server-event" value="notice" style="padding: 10px;">
              </div>
              <div class="form-group">
                <label>Data (JSON/String)</label>
                <textarea id="socket-server-msg" style="height: 60px; padding: 10px;">{"msg": "Hello all clients!"}</textarea>
              </div>
              <div class="button-group">
                <button class="primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #059669;" onclick="window.networkController.broadcastSocketServer()">
                  <i data-lucide="broadcast" style="width: 14px; height: 14px;"></i> Broadcast to All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  private getTcpTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <!-- TCP Client Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="terminal" style="color: var(--secondary); width: 20px;"></i>
              <h5 style="margin: 0; color: var(--secondary);">1. TCP Client</h5>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 100px; gap: 1rem;">
              <div class="form-group">
                <label>Remote Host</label>
                <input type="text" id="tcp-host" value="127.0.0.1" style="padding: 10px;">
              </div>
              <div class="form-group">
                <label>Port</label>
                <input type="number" id="tcp-port" value="8080" style="padding: 10px;">
              </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label>Message to Send</label>
              <input type="text" id="tcp-msg" value="Hello Server" style="padding: 10px;">
            </div>
            <div class="button-group">
              <button class="primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;" onclick="window.networkController.testTcp()">
                <i data-lucide="zap" style="width: 14px; height: 14px;"></i> Connect & Send
              </button>
            </div>
          </div>

          <!-- TCP Server Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="box" style="color: #10b981; width: 20px;"></i>
              <h5 style="margin: 0; color: #10b981;">2. TCP Server (Node.js)</h5>
            </div>

            <div class="form-group">
              <label>Listen Port</label>
              <input type="number" id="tcp-server-port" value="8888" style="padding: 10px;">
            </div>
            <div class="button-group" style="margin-top: 1rem;">
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #059669;" onclick="window.networkController.startTcpServer()">
                <i data-lucide="play" style="width: 14px; height: 14px;"></i> Start
              </button>
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #ef4444;" onclick="window.networkController.stopTcpServer()">
                <i data-lucide="square" style="width: 14px; height: 14px;"></i> Stop
              </button>
            </div>
            <div class="form-group" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
              <label>Broadcast Message</label>
              <input type="text" id="tcp-server-msg" value="Hello all clients!" style="padding: 10px;">
            </div>
            <div class="button-group">
              <button class="primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #059669;" onclick="window.networkController.broadcastTcpServer()">
                <i data-lucide="broadcast" style="width: 14px; height: 14px;"></i> Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>`;
  }

  private getUdpTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <!-- UDP Send -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="send" style="color: #f59e0b; width: 20px;"></i>
              <h5 style="margin: 0; color: #f59e0b;">1. Send UDP Packet</h5>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 100px; gap: 1rem;">
              <div class="form-group">
                <label>Remote Host</label>
                <input type="text" id="udp-host" value="127.0.0.1" style="padding: 10px;">
              </div>
              <div class="form-group">
                <label>Port</label>
                <input type="number" id="udp-port" value="5000" style="padding: 10px;">
              </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label>Packet Data</label>
              <input type="text" id="udp-msg" value="Hello UDP" style="padding: 10px;">
            </div>
            <div class="button-group">
              <button class="primary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; background: #d97706;" onclick="window.networkController.testUdp()">
                <i data-lucide="zap" style="width: 14px; height: 14px;"></i> Send Packet
              </button>
            </div>
          </div>

          <!-- UDP Listen -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="radio" style="color: #10b981; width: 20px;"></i>
              <h5 style="margin: 0; color: #10b981;">2. Listen (Bind Port)</h5>
            </div>

            <div class="form-group">
              <label>Local Port to Bind</label>
              <input type="number" id="udp-bind-port" value="5001" style="padding: 10px;">
            </div>
            <div class="button-group" style="margin-top: 1.5rem;">
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #059669;" onclick="window.networkController.testUdpBind()">
                <i data-lucide="play" style="width: 14px; height: 14px;"></i> Start
              </button>
              <button class="primary" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; background: #ef4444;" onclick="window.networkController.testUdpClose()">
                <i data-lucide="square" style="width: 14px; height: 14px;"></i> Stop
              </button>
            </div>
            <p style="font-size: 0.7rem; color: var(--text-dim); margin-top: 1rem; line-height: 1.4;">
              * UDP 수신 대기를 시작하면 해당 포트로 들어오는 패킷을 로그 창에 출력합니다.
            </p>
          </div>
        </div>
      </div>`;
  }
}
