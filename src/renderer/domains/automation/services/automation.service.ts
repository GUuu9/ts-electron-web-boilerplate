import { AutomationRepository } from '../../../data/ipc/automation/automation.repository.js';

export class AutomationService {
  constructor(private repository: AutomationRepository) {}

  public onStartShortcut(callback: () => void): void {
    this.repository.onStartShortcut(callback);
  }

  public onStopShortcut(callback: () => void): void {
    this.repository.onStopShortcut(callback);
  }

  public onPickShortcut(callback: () => void): void {
    this.repository.onPickShortcut(callback);
  }

  public async moveMouse(x: number, y: number): Promise<void> {
    await this.repository.moveMouse(x, y);
  }

  public async getMousePosition(): Promise<{ x: number, y: number } | null> {
    return await this.repository.getMousePosition();
  }

  public async clickMouse(button: 'left' | 'right' | 'middle', durationMs?: number): Promise<void> {
    await this.repository.clickMouse(button, durationMs);
  }

  public async doubleClickMouse(): Promise<void> {
    await this.repository.doubleClickMouse();
  }

  public async scrollMouse(amount: number): Promise<void> {
    await this.repository.scrollMouse(amount);
  }

  public async dragMouse(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    await this.repository.dragMouse(fromX, fromY, toX, toY);
  }

  public async typeText(text: string): Promise<void> {
    await this.repository.typeText(text);
  }

  public async pressKey(key: string, durationMs?: number): Promise<void> {
    await this.repository.pressKey(key, durationMs);
  }
}
