import { AutomationRepository } from '../../../data/ipc/automation/automation.repository.js';

export class AutomationService {
  constructor(private repository: AutomationRepository) {}

  public async moveMouse(x: number, y: number): Promise<void> {
    await this.repository.moveMouse(x, y);
  }

  public async clickMouse(button: 'left' | 'right' | 'middle', durationMs?: number): Promise<void> {
    await this.repository.clickMouse(button, durationMs);
  }

  public async typeText(text: string): Promise<void> {
    await this.repository.typeText(text);
  }

  public async pressKey(key: string, durationMs?: number): Promise<void> {
    await this.repository.pressKey(key, durationMs);
  }
}
