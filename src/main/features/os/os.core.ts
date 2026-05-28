import { ipcMain, type BrowserWindow } from 'electron';
import { BackendModule } from '../../core/backend-module.js';
import { NotifyManager } from './notify/notify.manager.js';
import { ShortcutManager } from './shortcut/shortcut.manager.js';
import { TrayManager } from './tray/tray.manager.js';

/**
 * OSCoreModule (Backend Facade)
 * OS 관련 하위 매니저들을 조립하고 관리합니다.
 */
export class OSCoreModule implements BackendModule {
  private notifyManager = new NotifyManager();
  private shortcutManager = new ShortcutManager();
  private trayManager = new TrayManager();

  public setupHandlers(mainWindow: BrowserWindow | null): void {
    this.shortcutManager.register(mainWindow);
    this.trayManager.init();

    ipcMain.handle('os-notify', (_, title: string, body: string) => {
      this.notifyManager.send(title, body);
    });
  }
}
