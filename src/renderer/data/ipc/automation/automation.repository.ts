/**
 * Automation Repository
 */
export class AutomationRepository {
  public onStartShortcut(callback: () => void): void {
    if (!(window as any).electronAPI?.automation) return;
    (window as any).electronAPI.automation.onStartShortcut(callback);
  }
  public onStopShortcut(callback: () => void): void {
    if (!(window as any).electronAPI?.automation) return;
    (window as any).electronAPI.automation.onStopShortcut(callback);
  }
  public onPickShortcut(callback: () => void): void {
    if (!(window as any).electronAPI?.automation) return;
    (window as any).electronAPI.automation.onPickShortcut(callback);
  }
  public async moveMouse(x: number, y: number): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.moveMouse(x, y);
  }
  public async getMousePosition(): Promise<{ x: number, y: number } | null> {
    if (!(window as any).electronAPI?.automation) return null;
    return await (window as any).electronAPI.automation.getMousePosition();
  }
  public async clickMouse(button: 'left' | 'right' | 'middle', durationMs?: number): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.clickMouse(button, durationMs);
  }
  public async doubleClickMouse(): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.doubleClickMouse();
  }
  public async scrollMouse(amount: number): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.scrollMouse(amount);
  }
  public async dragMouse(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.dragMouse(fromX, fromY, toX, toY);
  }
  public async typeText(text: string): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.typeText(text);
  }
  public async pressKey(key: string, durationMs?: number): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.pressKey(key, durationMs);
  }
}
