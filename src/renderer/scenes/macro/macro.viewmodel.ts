import { MacroSceneService } from './macroTest.service.js';
import { MacroSequence } from './macro.models.js';

export class MacroViewModel {
  private isRunning = false;

  constructor(private service: MacroSceneService) {}

  public async runMacro(sequence: MacroSequence) {
    this.isRunning = true;
    let loop = 0;
    
    while (this.isRunning && (sequence.loopCount === 0 || loop < sequence.loopCount)) {
      for (const action of sequence.actions) {
        if (!this.isRunning) break;
        await this.service.executeAction(action);
        if (action.delayBeforeMs) await new Promise(r => setTimeout(r, action.delayBeforeMs));
      }
      loop++;
    }
  }

  public stopMacro() {
    this.isRunning = false;
  }

  public async save(sequence: MacroSequence) {
    await this.service.saveMacro(sequence);
  }

  public async load(id: string) {
    return await this.service.loadMacro(id);
  }
}
