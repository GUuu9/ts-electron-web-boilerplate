import { Tray, Menu } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TrayManager {
  private tray: Tray | null = null;

  public init() {
    // dist-electron/main/features/os/tray/ 에서 assets 폴더로 가기 위해 3단계 상위 이동
    const iconPath = path.join(__dirname, '../../assets/icons/icon.png');
    
    if (fs.existsSync(iconPath)) {
      this.tray = new Tray(iconPath);
      this.tray.setContextMenu(Menu.buildFromTemplate([
        { label: '종료', role: 'quit' }
      ]));
    } else {
      console.warn('[Tray] Icon not found at:', iconPath);
    }
  }
}
