/**
 * Automation Repository
 */
export class AutomationRepository {
  public async moveMouse(x: number, y: number): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.moveMouse(x, y);
  }
  public async clickMouse(button: 'left' | 'right' | 'middle', durationMs?: number): Promise<void> {
    if (!(window as any).electronAPI?.automation) return;
    await (window as any).electronAPI.automation.clickMouse(button, durationMs);
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
