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
        <div class="test-section">
          <h4>HTTP / REST API</h4>
          <div class="form-group">
            <label>Target URL</label>
            <input type="text" id="http-url" value="https://jsonplaceholder.typicode.com/todos/1">
          </div>
          <div class="button-group">
            <button class="primary" onclick="window.networkController.testHttp()">Send GET Request</button>
          </div>
        </div>
      </div>`;
  }

  private getFirebaseTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          
          <!-- Data Submit Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="upload-cloud" style="color: #f87171; width: 20px;"></i>
              <h5 style="margin: 0; color: #f87171;">Store Data (Write)</h5>
            </div>
            
            <div class="form-group">
              <label>Data Key (Identifier)</label>
              <input type="text" id="fb-key" placeholder="e.g. device_status" value="status_report">
            </div>
            
            <div class="form-group">
              <label>Data Value (JSON/String)</label>
              <textarea id="fb-value" style="height: 60px;">{"temp": 24.5, "status": "active"}</textarea>
            </div>

            <div class="button-group" style="margin-top: 1.5rem;">
              <button class="primary" style="background: #ef4444;" onclick="window.networkController.testFirebaseSubmit()">
                <i data-lucide="send" style="width: 14px; margin-right: 4px;"></i> Push to Firestore
              </button>
            </div>
          </div>

          <!-- Data Retrieval Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
              <i data-lucide="database" style="color: #fbbf24; width: 20px;"></i>
              <h5 style="margin: 0; color: #fbbf24;">Data Retrieval (Read)</h5>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
              <label>Retrieval Limit</label>
              <input type="number" id="fb-limit" value="10" min="1" max="50">
            </div>

            <button class="primary" style="background: #f59e0b; width: 100%;" onclick="window.networkController.testFirebaseLoad()">
              <i data-lucide="refresh-cw" style="width: 14px; margin-right: 4px;"></i> Fetch Latest Data
            </button>

            <div class="form-group" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem;">
              <label>Result List (From Cloud)</label>
              <textarea id="fb-result" style="height: 180px; font-family: monospace; font-size: 0.75rem; line-height: 1.4;" readonly placeholder="Click fetch to load..."></textarea>
            </div>
          </div>

        </div>
        <p style="font-size: 0.75rem; color: var(--text-dim); margin-top: 1rem;">* Firebase 기능을 사용하려면 .env 파일에 유효한 VITE_FIREBASE_* 키 설정이 필요합니다.</p>
      </div>`;
  }

  private getSocketTemplate(): string {
    return `
      <div class="test-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          <!-- Socket.io Client Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <h5 style="color: var(--secondary); margin-bottom: 1rem;">1. Socket.io Client</h5>
            <div class="form-group">
              <label>Server URL</label>
              <input type="text" id="socket-url" value="http://localhost:3000">
            </div>
            <div class="button-group">
              <button class="primary" onclick="window.networkController.testSocketConnect()">Connect</button>
              <button class="primary" style="background: #ef4444;" onclick="window.networkController.testSocketDisconnect()">Disconnect</button>
            </div>
            
            <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
              <div class="form-group">
                <label>Event Name</label>
                <input type="text" id="socket-event" value="chat message">
              </div>
              <div class="form-group">
                <label>Data (JSON/String)</label>
                <textarea id="socket-msg">{"text": "Hello Server!"}</textarea>
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.networkController.testSocketEmit()">Emit Event</button>
              </div>
            </div>

            <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
              <div style="display: grid; grid-template-columns: 1fr 100px; gap: 1rem;">
                <div class="form-group">
                  <label>Listen Event Name</label>
                  <input type="text" id="socket-listen-event" value="response">
                </div>
                <div class="form-group">
                  <label>Max Count</label>
                  <input type="number" id="socket-listen-count" value="1">
                </div>
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.networkController.testSocketListen()">Start Listening</button>
              </div>
            </div>
          </div>

          <!-- Socket.io Server Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <h5 style="color: #10b981; margin-bottom: 1rem;">2. Socket.io Server (Node.js)</h5>
            <div class="form-group">
              <label>Listen Port</label>
              <input type="number" id="socket-server-port" value="3000">
            </div>
            <div class="button-group">
              <button class="primary" style="background: #059669;" onclick="window.networkController.startSocketServer()">Start Server</button>
              <button class="primary" style="background: #ef4444;" onclick="window.networkController.stopSocketServer()">Stop Server</button>
            </div>

            <div style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
              <div class="form-group">
                <label>Broadcast Event</label>
                <input type="text" id="socket-server-event" value="notice">
              </div>
              <div class="form-group">
                <label>Data (JSON/String)</label>
                <textarea id="socket-server-msg">{"msg": "Hello all clients!"}</textarea>
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.networkController.broadcastSocketServer()">Broadcast</button>
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
            <h5 style="color: var(--secondary); margin-bottom: 1rem;">1. TCP Client</h5>
            <div style="display: grid; grid-template-columns: 1fr 100px; gap: 1rem;">
              <div class="form-group">
                <label>Remote Host</label>
                <input type="text" id="tcp-host" value="127.0.0.1">
              </div>
              <div class="form-group">
                <label>Port</label>
                <input type="number" id="tcp-port" value="8080">
              </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label>Message</label>
              <input type="text" id="tcp-msg" value="Hello Server">
            </div>
            <div class="button-group">
              <button class="primary" onclick="window.networkController.testTcp()">Connect & Send</button>
            </div>
          </div>

          <!-- TCP Server Section -->
          <div class="test-section" style="background: rgba(255,255,255,0.01);">
            <h5 style="color: #10b981; margin-bottom: 1rem;">2. TCP Server (Node.js)</h5>
            <div class="form-group">
              <label>Listen Port</label>
              <input type="number" id="tcp-server-port" value="8888">
            </div>
            <div class="button-group" style="margin-top: 1rem;">
              <button class="primary" style="background: #059669;" onclick="window.networkController.startTcpServer()">Start Server</button>
              <button class="primary" style="background: #ef4444;" onclick="window.networkController.stopTcpServer()">Stop Server</button>
            </div>
            <div class="form-group" style="margin-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1rem;">
              <label>Broadcast Message</label>
              <input type="text" id="tcp-server-msg" value="Hello all clients!">
            </div>
            <div class="button-group">
              <button class="primary" onclick="window.networkController.broadcastTcpServer()">Broadcast</button>
            </div>
          </div>
        </div>
      </div>`;
  }

  private getUdpTemplate(): string {
    return `
      <div class="test-form">
        <div class="test-section">
          <h4>UDP Packet (Desktop Only)</h4>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="test-section" style="background: rgba(255,255,255,0.01);">
              <h5>1. Send Packet</h5>
              <div class="form-group">
                <label>Remote Host</label>
                <input type="text" id="udp-host" value="127.0.0.1">
              </div>
              <div class="form-group">
                <label>Remote Port</label>
                <input type="number" id="udp-port" value="5000">
              </div>
              <div class="form-group" style="margin-top: 1rem;">
                <label>Data</label>
                <input type="text" id="udp-msg" value="Hello UDP">
              </div>
              <button class="primary" style="margin-top: 1rem;" onclick="window.networkController.testUdp()">Send</button>
            </div>
            <div class="test-section" style="background: rgba(255,255,255,0.01);">
              <h5>2. Listen (Bind)</h5>
              <div class="form-group">
                <label>Local Port</label>
                <input type="number" id="udp-bind-port" value="5001">
              </div>
              <div class="button-group" style="margin-top: 1rem;">
                <button class="primary" onclick="window.networkController.testUdpBind()">Start Listening</button>
                <button class="primary" style="background: #ef4444;" onclick="window.networkController.testUdpClose()">Stop Listening</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }
}
