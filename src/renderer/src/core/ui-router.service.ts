declare const lucide: any;

/**
 * UIRouterService
 * 역할: 렌더러 프로세스 내의 화면 전환(Routing)을 관리하는 서비스입니다.
 * SPA(Single Page Application) 구조를 유지하며 대시보드와 상세 뷰 사이의 상태를 제어합니다.
 */
export class UIRouterService {
  private dashboardView: HTMLElement | null;
  private detailView: HTMLElement | null;
  private titleElement: HTMLElement | null;
  private descElement: HTMLElement | null;
  private contentElement: HTMLElement | null;
  
  private currentCategory: string = '';

  constructor() {
    this.dashboardView = document.getElementById('dashboard-view');
    this.detailView = document.getElementById('detail-view');
    this.titleElement = document.getElementById('test-title');
    this.descElement = document.getElementById('test-desc');
    this.contentElement = document.getElementById('test-content');
  }

  /**
   * 메인 대시보드 화면을 보여줍니다.
   */
  public showDashboard(): void {
    if (this.dashboardView) this.dashboardView.style.display = 'grid';
    if (this.detailView) this.detailView.style.display = 'none';
    this.currentCategory = '';
  }

  /**
   * 특정 카테고리(Network, Device 등)의 상세 테스트 화면으로 전환합니다.
   * @param category 전환할 카테고리명
   */
  public showTestDetail(category: string): void {
    if (this.dashboardView) this.dashboardView.style.display = 'none';
    if (this.detailView) this.detailView.style.display = 'block';
    
    this.currentCategory = category;
    
    // 각 카테고리 진입 시 기본으로 보여줄 하위 탭 설정
    const defaultSub: Record<string, string> = {
      network: 'http',
      device: 'bluetooth',
      shared: 'calc'
    };
    
    this.renderCategoryLayout(category, defaultSub[category] || '');
  }

  /**
   * 카테고리별 레이아웃(제목, 탭 구성, 컨텐츠 영역)을 동적으로 렌더링합니다.
   */
  private renderCategoryLayout(category: string, subType: string): void {
    if (!this.titleElement || !this.descElement || !this.contentElement) return;

    // 1. 페이지 타이틀 설정
    const titles: Record<string, string> = {
      network: 'Network Infrastructure',
      device: 'Hardware Device Control',
      shared: 'Shared Service Logic',
      database: 'SQLite Database'
    };
    this.titleElement.innerText = titles[category] || 'Test';

    // 2. 상단 하위 탭(Tab) 구성 정의
    const tabs: Record<string, { id: string; label: string }[]> = {
      network: [
        { id: 'http', label: 'HTTP / REST' },
        { id: 'socket', label: 'Socket.io' },
        { id: 'tcp', label: 'TCP' },
        { id: 'udp', label: 'UDP Packet' }
      ],
      device: [
        { id: 'bluetooth', label: 'Bluetooth' },
        { id: 'usb', label: 'USB / HID' },
        { id: 'media', label: 'Media Devices' }
      ],
      shared: [
        { id: 'calc', label: 'Calculation' }
      ]
    };

    const categoryTabs = tabs[category] || [];
    let tabsHtml = '';
    if (categoryTabs.length > 1) {
      tabsHtml = `<div class="tab-group">`;
      categoryTabs.forEach(tab => {
        const activeClass = tab.id === subType ? 'active' : '';
        tabsHtml += `<button class="tab-btn ${activeClass}" onclick="window.uiRouter.switchSubTab('${tab.id}')">${tab.label}</button>`;
      });
      tabsHtml += `</div>`;
    }

    // 3. 실제 테스트 폼(HTML) 컨텐츠 생성
    const subContentHtml = this.getSubContentHtml(category, subType);

    this.contentElement.innerHTML = `${tabsHtml}<div id="sub-content">${subContentHtml}</div>`;
    
    // Lucide 아이콘 라이브러리 초기화 (HTML 삽입 후 실행 필요)
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  /**
   * 상세 페이지 내에서 하위 탭(예: HTTP -> Socket)을 전환합니다.
   * @param subType 전환할 하위 기능 ID
   */
  public switchSubTab(subType: string): void {
    const subContentArea = document.getElementById('sub-content');
    if (!subContentArea) return;

    // 탭 버튼 UI 상태(Active 클래스) 업데이트
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('onclick')?.includes(`'${subType}'`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 컨텐츠 영역만 교체
    subContentArea.innerHTML = this.getSubContentHtml(this.currentCategory, subType);
  }

  /**
   * 각 기능별 테스트 폼 HTML 템플릿을 반환합니다.
   * Hub-Delegate 패턴에 따라 호출되는 전역 컨트롤러(window.xxxController)가 포함되어 있습니다.
   */
  private getSubContentHtml(category: string, subType: string): string {
    switch (category) {
      case 'network':
        if (subType === 'http') return `
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
        
        if (subType === 'socket') return `
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

        if (subType === 'tcp') return `
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

        if (subType === 'udp') return `
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
        break;

      case 'device':
        if (subType === 'bluetooth') return `
          <div class="test-form">
            <div class="test-section">
              <h4>Bluetooth LE</h4>
              <div class="form-group">
                <label>Service UUID (Optional)</label>
                <input type="text" id="bt-uuid" placeholder="e.g. 0000180d-0000-1000-8000-00805f9b34fb">
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.deviceController.testBluetooth()">Scan for Device</button>
              </div>
            </div>
          </div>`;
        if (subType === 'usb') return `
          <div class="test-form">
            <div class="test-section">
              <h4>WebUSB API</h4>
              <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
                일반적인 USB 장치(직렬 통신, 전용 기기 등)와 통신합니다.
              </p>
              <div class="form-group">
                <label>Vendor ID (필터, 예: 0x1234)</label>
                <input type="text" id="usb-vendor" placeholder="Hex 또는 10진수 입력">
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.deviceController.testUsb()">Request USB Device</button>
              </div>
            </div>

            <div class="test-section" style="margin-top: 1.5rem;">
              <h4>WebHID API</h4>
              <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
                마우스, 키보드, 게임패드 등 입력 장치와 통신합니다.
              </p>
              <div class="button-group">
                <button class="primary" onclick="window.deviceController.testHid()">Request HID Device</button>
              </div>
            </div>
          </div>`;
        if (subType === 'media') return `
          <div class="test-form">
            <div class="test-section">
              <h4>Media Devices</h4>
              <div class="button-group">
                <button class="primary" onclick="window.deviceController.testMedia()">List Microphones/Cameras</button>
              </div>
              <div id="media-list" style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-dim);"></div>
            </div>
          </div>`;
        break;

      case 'shared':
        return `
          <div class="test-form">
            <div class="test-section">
              <h4>Shared Data Converter</h4>
              <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 1rem;">
                플랫폼 독립적인 공통 로직(shared/)을 테스트합니다. 숫자나 문자열을 입력하세요.
              </p>
              <div class="form-group">
                <label>Input Value</label>
                <input type="text" id="convert-input" placeholder="e.g. 255 or Hello">
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.sharedController.convertToHex()">Convert to Hex</button>
              </div>
            </div>
          </div>`;
      
      case 'database':
        return `<p style="color: #ef4444; padding: 2rem;">SQLite implementation in progress...</p>`;
    }
    return '';
  }
}
