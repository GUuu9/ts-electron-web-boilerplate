import { globalShortcut, type BrowserWindow } from 'electron';

export class ShortcutManager {
  public register(mainWindow: BrowserWindow | null) {
    // 앱 보이기/숨기기
    globalShortcut.register('CommandOrControl+Shift+X', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) mainWindow.hide();
        else { mainWindow.show(); mainWindow.focus(); }
      }
    });

    // 매크로 시작 (F5)
    globalShortcut.register('F5', () => {
      if (mainWindow) {
        mainWindow.webContents.send('macro:start-shortcut');
      }
    });

    // 매크로 중지 (F6)
    globalShortcut.register('F6', () => {
      if (mainWindow) {
        mainWindow.webContents.send('macro:stop-shortcut');
      }
    });

    // 좌표 추출 (F2)
    globalShortcut.register('F2', () => {
      if (mainWindow) {
        mainWindow.webContents.send('macro:pick-shortcut');
      }
    });
  }

  public unregisterAll() {
    globalShortcut.unregisterAll();
  }
}
