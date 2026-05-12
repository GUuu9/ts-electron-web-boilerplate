import { app, Tray, Menu, nativeImage, Notification, globalShortcut, BrowserWindow } from 'electron';
import * as path from 'path';

/**
 * OS Integration Service
 * 역할: 트레이 아이콘, 네이티브 알림, 전역 단축키, 커스텀 프로토콜 연동 관리
 */
export class OSIntegrationService {
  private tray: Tray | null = null;
  private mainWindow: BrowserWindow | null = null;

  constructor() {}

  /**
   * 서비스 초기화 (메인 창 참조 필요)
   */
  public init(window: BrowserWindow): void {
    this.mainWindow = window;
    this.setupTray();
    this.registerGlobalShortcuts();
    this.setupProtocolHandler();
  }

  /**
   * 1. 시스템 트레이 (Tray) 설정
   */
  private setupTray(): void {
    // macOS/Windows 공용으로 사용할 수 있는 22x22 크기의 템플릿 아이콘 생성
    // (검은색 사각형 데이터 URL - macOS 시스템이 테마에 따라 자동 반전시킴)
    const base64Icon = 'iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5AgKDA8VDR6mFAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLm3CYwAAACNJREFUOMtj/P//PwM1ARMDlcGj4VHDY8AYDQ9vS8fDoxYHABf9Bv7uPrS0AAAAAElFTkSuQmCC';
    const trayIcon = nativeImage.createFromBuffer(Buffer.from(base64Icon, 'base64'));
    
    // macOS에서 다크/라이트 모드에 따라 아이콘 색상이 자동 변하도록 설정
    trayIcon.setTemplateImage(true);
    
    this.tray = new Tray(trayIcon);
    
    const contextMenu = Menu.buildFromTemplate([
      { label: '🚀 앱 열기', click: () => {
          this.mainWindow?.show();
          this.mainWindow?.focus();
        } 
      },
      { label: '🔔 알림 테스트', click: () => this.notify('트레이 알림', '트레이 메뉴에서 보낸 알림입니다.') },
      { type: 'separator' },
      { label: '종료', click: () => {
          (app as any).isQuitting = true;
          app.quit();
        } 
      }
    ]);

    this.tray.setToolTip('My Cross Platform App');
    this.tray.setContextMenu(contextMenu);

    // 트레이 아이콘 클릭 시 동작 (macOS/Windows 공통)
    this.tray.on('click', () => {
      if (!this.mainWindow) return;
      if (this.mainWindow.isVisible()) {
        this.mainWindow.hide();
      } else {
        this.mainWindow.show();
        this.mainWindow.focus();
      }
    });
  }

  /**
   * 2. 네이티브 알림 (Notification)
   */
  public notify(title: string, body: string): void {
    console.log(`[OS] Attempting to show notification: ${title}`);
    
    if (!Notification.isSupported()) {
      console.error('[OS] System notifications are not supported on this platform/environment.');
      return;
    }

    try {
      const noti = new Notification({ 
        title, 
        body,
        silent: false,
        timeoutType: 'default'
      });

      noti.on('show', () => console.log('[OS] Notification shown successfully'));

      noti.on('click', () => {
        this.mainWindow?.show();
        this.mainWindow?.focus();
      });

      noti.show();
    } catch (err) {
      console.error('[OS] Failed to create notification object:', err);
    }
  }

  /**
   * 3. 전역 단축키 (Global Shortcut)
   */
  private registerGlobalShortcuts(): void {
    const shortcut = process.platform === 'darwin' ? 'Command+Shift+X' : 'Alt+Shift+X';

    // 기존 등록 해제 (중복 등록 방지)
    globalShortcut.unregister(shortcut);

    const success = globalShortcut.register(shortcut, () => {
      if (!this.mainWindow || this.mainWindow.isDestroyed()) {
        console.warn('[OS] Main window is lost or destroyed. Cannot toggle.');
        return;
      }

      if (this.mainWindow.isFocused() && this.mainWindow.isVisible()) {
        // 창이 활성화되어 있고 보이면 -> 숨김
        this.mainWindow.hide();
      } else {
        // 그 외 모든 상황 (숨겨짐, 최소화됨, 포커스 없음) -> 보여줌
        if (this.mainWindow.isMinimized()) this.mainWindow.restore();
        this.mainWindow.show();
        this.mainWindow.focus();
      }
    });

    if (success) {
      console.log(`[OS] Global shortcut registered successfully: ${shortcut}`);
    } else {
      console.error(`[OS] Failed to register global shortcut: ${shortcut}. It might be used by another app.`);
    }
  }

  /**
   * 4. 커스텀 프로토콜 (Deep Link) 처리
   * 예: my-app://test?msg=hello
   */
  private setupProtocolHandler(): void {
    const protocol = 'my-app';
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(protocol, process.execPath, [path.resolve(process.argv[1])]);
      }
    } else {
      app.setAsDefaultProtocolClient(protocol);
    }
  }

  /**
   * 앱 종료 시 리소스 해제
   */
  public destroy(): void {
    globalShortcut.unregisterAll();
  }
}
