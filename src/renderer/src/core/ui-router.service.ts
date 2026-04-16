declare const lucide: any;

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

  public showDashboard(): void {
    if (this.dashboardView) this.dashboardView.style.display = 'grid';
    if (this.detailView) this.detailView.style.display = 'none';
    this.currentCategory = '';
  }

  public showTestDetail(category: string): void {
    if (this.dashboardView) this.dashboardView.style.display = 'none';
    if (this.detailView) this.detailView.style.display = 'block';
    
    this.currentCategory = category;
    
    // 기본적으로 첫 번째 하위 기능을 선택
    const defaultSub: Record<string, string> = {
      network: 'http',
      device: 'bluetooth',
      shared: 'calc'
    };
    
    this.renderCategoryLayout(category, defaultSub[category] || '');
  }

  private renderCategoryLayout(category: string, subType: string): void {
    if (!this.titleElement || !this.descElement || !this.contentElement) return;

    // 1. 타이틀 설정
    const titles: Record<string, string> = {
      network: 'Network Infrastructure',
      device: 'Hardware Device Control',
      shared: 'Shared Service Logic',
      database: 'SQLite Database'
    };
    this.titleElement.innerText = titles[category] || 'Test';

    // 2. 탭 구성
    const tabs: Record<string, { id: string; label: string }[]> = {
      network: [
        { id: 'http', label: 'HTTP / REST' },
        { id: 'socket', label: 'Socket.io' },
        { id: 'tcp', label: 'TCP Client' },
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

    // 3. 서브 컨텐츠 렌더링
    const subContentHtml = this.getSubContentHtml(category, subType);

    this.contentElement.innerHTML = `${tabsHtml}<div id="sub-content">${subContentHtml}</div>`;
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // 외부(탭 버튼)에서 호출할 하위 탭 전환 함수
  public switchSubTab(subType: string): void {
    const subContentArea = document.getElementById('sub-content');
    if (!subContentArea) return;

    // 탭 버튼 상태 업데이트
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
      // 탭 버튼의 onclick 텍스트에 subType이 포함되어 있는지 확인하여 active 클래스 제어
      if (btn.getAttribute('onclick')?.includes(`'${subType}'`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    subContentArea.innerHTML = this.getSubContentHtml(this.currentCategory, subType);
  }

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
            <div class="test-section">
              <h4>Socket.io Real-time</h4>
              <div class="form-group">
                <label>Server URL</label>
                <input type="text" id="socket-url" value="http://localhost:3000">
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.networkController.testSocketConnect()">Connect</button>
                <button class="primary" style="background: #ef4444;" onclick="window.networkController.testSocketDisconnect()">Disconnect</button>
              </div>
              
              <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
                <div style="display: grid; grid-template-columns: 150px 1fr; gap: 1rem;">
                  <div class="form-group">
                    <label>Event Name</label>
                    <input type="text" id="socket-event" value="chat message">
                  </div>
                  <div class="form-group">
                    <label>Data (JSON or String)</label>
                    <textarea id="socket-msg">{"text": "Hello Server!", "timestamp": ${Date.now()}}</textarea>
                  </div>
                </div>
                <div class="button-group">
                  <button class="primary" onclick="window.networkController.testSocketEmit()">Emit Event</button>
                </div>
              </div>

              <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
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
          </div>`;

        if (subType === 'tcp') return `
          <div class="test-form">
            <div class="test-section">
              <h4>TCP Stream (Desktop Only)</h4>
              <div style="display: grid; grid-template-columns: 1fr 100px; gap: 1rem;">
                <div class="form-group">
                  <label>Host</label>
                  <input type="text" id="tcp-host" value="127.0.0.1">
                </div>
                <div class="form-group">
                  <label>Port</label>
                  <input type="number" id="tcp-port" value="8080">
                </div>
              </div>
              <div class="form-group" style="margin-top: 1rem;">
                <label>Message</label>
                <input type="text" id="tcp-msg" value="Hello TCP Server">
              </div>
              <div class="button-group">
                <button class="primary" onclick="window.networkController.testTcp()">Connect & Send</button>
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
                  <button class="primary" style="margin-top: 1rem;" onclick="window.networkController.testUdpBind()">Start Listening</button>
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
          <div class="test-section">
            <h4>CalcService Test</h4>
            <div class="button-group">
              <button class="primary" onclick="window.testerController.runTest('calc')">Execute Shared Logic</button>
            </div>
          </div>`;
      
      case 'database':
        return `<p style="color: #ef4444; padding: 2rem;">SQLite implementation in progress...</p>`;
    }
    return '';
  }
}
