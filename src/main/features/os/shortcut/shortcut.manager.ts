import { globalShortcut, type BrowserWindow } from 'electron';

export class ShortcutManager {
  public register(mainWindow: BrowserWindow | null) {
    globalShortcut.register('CommandOrControl+Shift+X', () => {
      console.log('[OS] Global Shortcut Triggered');
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });
  }
}
