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

  constructor(private readonly views: Record<string, any> = {}) {
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
      shared: 'calc',
      logger: 'ui',
      maintenance: 'system'
    };
    
    this.renderCategoryLayout(category, defaultSub[category] || '');
    this.focusFirstElement();
  }

  /**
   * 테스트 컨텐츠 내의 첫 번째 입력 요소나 버튼에 포커스를 줍니다.
   */
  private focusFirstElement(): void {
    setTimeout(() => {
      const firstInteractive = this.contentElement?.querySelector('button, input, textarea') as HTMLElement;
      if (firstInteractive) firstInteractive.focus();
    }, 50);
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
      database: 'SQLite Database',
      logger: 'Audit & UI Logging',
      maintenance: 'System Maintenance'
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
        { id: 'calc', label: 'Calculation' },
        { id: 'security', label: 'Security' }
      ],
      logger: [
        { id: 'ui', label: 'UI Logger' },
        { id: 'audit', label: 'Audit Log' }
      ],
      maintenance: [
        { id: 'system', label: 'System Resource' },
        { id: 'os', label: 'OS Integration' },
        { id: 'utils', label: 'Tools' }
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
    const view = this.views[category];
    if (view && typeof view.getHtml === 'function') {
      return view.getHtml(subType);
    }

    // 기본Fallback (View가 아직 구현되지 않았거나 등록되지 않은 경우)
    switch (category) {
      case 'database':
        return `<p style="color: #ef4444; padding: 2rem;">SQLite implementation in progress...</p>`;
      default:
        return `<p style="color: var(--text-dim); padding: 2rem;">Coming soon...</p>`;
    }
  }
}
