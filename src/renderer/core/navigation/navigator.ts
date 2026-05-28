/**
 * Navigator 서비스 (Core)
 * 애플리케이션의 View 전환을 관리합니다.
 */
export class Navigator {
  private currentView: any = null;

  public navigate(view: { render: (containerId: string) => void, destroy?: () => void }): void {
    if (this.currentView && this.currentView.destroy) {
      this.currentView.destroy();
    }
    
    const dashboard = document.getElementById('dashboard-view');
    const detail = document.getElementById('detail-view');
    const content = document.getElementById('test-content');

    if (dashboard) dashboard.style.display = 'none';
    if (detail) detail.style.display = 'block';
    
    if (content) {
      content.innerHTML = ''; // 상세 콘텐츠 영역만 비움
      view.render('test-content'); // test-content 영역에 렌더링
    }
    
    this.currentView = view;
  }

  public showDashboard(): void {
    if (this.currentView && this.currentView.destroy) {
      this.currentView.destroy();
      this.currentView = null;
    }
    
    const dashboard = document.getElementById('dashboard-view');
    const detail = document.getElementById('detail-view');

    if (dashboard) dashboard.style.display = 'grid';
    if (detail) detail.style.display = 'none';
  }
}
