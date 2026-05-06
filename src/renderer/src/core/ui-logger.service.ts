/**
 * UILoggerService
 * 역할: 애플리케이션의 플로팅 로그 패널을 관리하고 로그를 출력합니다.
 * 기능: 드래그 이동, 리사이즈, 최소화/확장, 도킹 모드 및 외부 창 분리 지원.
 */
export class UILoggerService {
  private logElement: HTMLElement | null = null;
  private wrapper: HTMLElement | null = null;
  private header: HTMLElement | null = null;
  private resizer: HTMLElement | null = null;
  private minimizeBtn: HTMLElement | null = null;
  private detachBtn: HTMLElement | null = null;
  private isMinimized = false;
  private isDetached = false;
  private isDocked = false;

  constructor() {
    this.logElement = document.getElementById('log-panel');
    this.wrapper = document.getElementById('floating-log-panel');
    this.header = document.getElementById('log-header');
    this.resizer = document.getElementById('log-resizer');
    this.minimizeBtn = document.getElementById('minimize-btn');
    this.detachBtn = document.getElementById('detach-btn');

    this.initFloatingEvents();
    this.checkPlatform();
    this.initKeyboardShortcuts();
  }

  /**
   * 키보드 단축키를 초기화합니다.
   */
  private initKeyboardShortcuts(): void {
    window.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ctrl+Shift+L 또는 Cmd+Shift+L: 도킹 모드 전환
      // e.code를 사용하면 대소문자나 레이아웃에 관계없이 물리적인 'L' 키를 인식합니다.
      const isLKey = e.code === 'KeyL' || e.key.toLowerCase() === 'l';
      const isModifier = e.ctrlKey || e.metaKey;

      if (isModifier && e.shiftKey && isLKey) {
        e.preventDefault();
        this.toggleDock();
      }
    });
  }

  /**
   * 플랫폼을 체크하여 데스크탑 환경일 경우 분리 버튼을 표시합니다.
   */
  private checkPlatform(): void {
    if (window.electronAPI?.logger && this.detachBtn) {
      this.detachBtn.style.display = 'flex';
    }
  }

  /**
   * 플로팅 창의 드래그 및 리사이즈 이벤트를 초기화합니다.
   */
  private initFloatingEvents(): void {
    if (!this.wrapper || !this.header || !this.resizer) return;

    let isDragging = false;
    let isResizing = false;
    let startX: number, startY: number, startW: number, startH: number;
    let startRight: number, startBottom: number;

    // --- 드래그 로직 (Header) ---
    this.header.addEventListener('mousedown', (e) => {
      if (this.isMinimized || this.isDocked) return;
      if ((e.target as HTMLElement).closest('button')) return;

      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      const rect = this.wrapper!.getBoundingClientRect();
      startRight = window.innerWidth - rect.right;
      startBottom = window.innerHeight - rect.bottom;
      
      this.wrapper!.style.transition = 'none';
      document.body.style.cursor = 'grabbing';
    });

    // --- 리사이즈 로직 (Resizer) ---
    this.resizer.addEventListener('mousedown', (e) => {
      if (this.isDocked) return;
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      startW = this.wrapper!.offsetWidth;
      startH = this.wrapper!.offsetHeight;
      
      this.wrapper!.style.transition = 'none';
      document.body.style.cursor = 'nwse-resize';
      e.stopPropagation();
      e.preventDefault();
    });

    // --- 공통 마우스 이동/업 이벤트 ---
    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = startX - e.clientX;
        const dy = startY - e.clientY;
        
        let newRight = startRight + dx;
        let newBottom = startBottom + dy;

        const maxRight = window.innerWidth - this.wrapper!.offsetWidth;
        const maxBottom = window.innerHeight - this.wrapper!.offsetHeight;

        newRight = Math.max(0, Math.min(newRight, maxRight));
        newBottom = Math.max(0, Math.min(newBottom, maxBottom));

        this.wrapper!.style.right = `${newRight}px`;
        this.wrapper!.style.bottom = `${newBottom}px`;
      }

      if (isResizing) {
        const dw = startX - e.clientX;
        const dh = startY - e.clientY;
        
        let newWidth = startW + dw;
        let newHeight = startH + dh;

        const currentRight = parseInt(this.wrapper!.style.right || '0');
        const currentBottom = parseInt(this.wrapper!.style.bottom || '0');
        const maxWidth = window.innerWidth - currentRight;
        const maxHeight = window.innerHeight - currentBottom;

        newWidth = Math.max(200, Math.min(newWidth, maxWidth));
        newHeight = Math.max(40, Math.min(newHeight, maxHeight));

        this.wrapper!.style.width = `${newWidth}px`;
        this.wrapper!.style.height = `${newHeight}px`;
      }
    });

    window.addEventListener('mouseup', () => {
      if (isDragging || isResizing) {
        isDragging = false;
        isResizing = false;
        this.wrapper!.style.transition = 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease';
        document.body.style.cursor = 'default';
      }
    });
  }

  /**
   * 최소화 상태를 토글합니다.
   */
  public toggleMinimize(): void {
    if (!this.wrapper || !this.minimizeBtn) return;
    this.isMinimized = !this.isMinimized;
    
    if (this.isMinimized) {
      this.wrapper.classList.add('minimized');
      document.body.classList.add('logger-minimized');
      this.minimizeBtn.innerHTML = '<i data-lucide="square" size="14"></i>';
    } else {
      this.wrapper.classList.remove('minimized');
      document.body.classList.remove('logger-minimized');
      this.minimizeBtn.innerHTML = '<i data-lucide="minus" size="14"></i>';
    }

    setTimeout(() => {
      if (window.lucide) {
        (window.lucide as any).createIcons();
      }
    }, 310);
  }

  /**
   * 도킹 모드(하단 고정)를 토글합니다.
   */
  public toggleDock(): void {
    if (!this.wrapper || this.isDetached) return;
    this.isDocked = !this.isDocked;
    
    if (this.isDocked) {
      this.wrapper.classList.add('docked');
      document.body.classList.add('logger-docked');
      this.log('UI Logger가 하단에 도킹되었습니다.', false);
    } else {
      this.wrapper.classList.remove('docked');
      document.body.classList.remove('logger-docked');
      this.wrapper.style.right = '2rem';
      this.wrapper.style.bottom = '2rem';
      this.wrapper.style.width = '400px';
      this.wrapper.style.height = '300px';
      this.log('UI Logger가 플로팅 모드로 전환되었습니다.', false);
    }
  }

  /**
   * 로그 창을 외부 새 창으로 분리합니다. (데스크탑 전용)
   */
  public async detachWindow(): Promise<void> {
    if (!window.electronAPI?.logger) return;
    
    try {
      await window.electronAPI.logger.open();
      this.isDetached = true;
      this.log('로그 창이 외부 창으로 분리되었습니다.', false);
      
      window.electronAPI.logger.onClosed(() => {
        this.isDetached = false;
        if (this.wrapper) this.wrapper.style.display = 'flex';
        this.log('외부 로그 창이 닫혀 내부 패널로 복귀합니다.', false);
      });

      if (this.wrapper) {
        this.wrapper.style.display = 'none';
      }
    } catch (err) {
      this.log(`외부 창 분리 실패: ${err}`, true);
    }
  }

  /**
   * 로그 패널에 새로운 로그 메시지를 추가합니다.
   */
  public log(message: string, isError = false): void {
    if (this.isDetached && window.electronAPI?.logger) {
      window.electronAPI.logger.send({ message, isError });
      return;
    }

    if (!this.logElement) return;
    
    const time = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    
    logEntry.style.color = isError ? '#ef4444' : '#10b981';
    logEntry.innerText = `[${time}] ${message}`;
    
    this.logElement.appendChild(logEntry);
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  /**
   * 로그 패널을 비웁니다.
   */
  public clear(): void {
    if (this.logElement) {
      this.logElement.innerHTML = '<div style="color: #64748b;">> Ready to test...</div>';
    }
  }
}
