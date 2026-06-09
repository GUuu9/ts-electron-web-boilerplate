import { MacroSceneService } from './macroTest.service.js';
import { MacroSequence, MacroAction } from './macro.models.js';

export class MacroViewModel {
  private isRunning = false;
  private currentSequence: MacroSequence = { id: 'default', name: 'New Macro', actions: [], loopCount: 1 };

  constructor(private service: MacroSceneService) {}

  public getSequence() { return this.currentSequence; }
  
  public setSequence(seq: MacroSequence) { this.currentSequence = seq; }

  public addAction(action: MacroAction) {
    this.currentSequence.actions.push(action);
  }

  public removeAction(index: number) {
    this.currentSequence.actions.splice(index, 1);
  }

  public async runMacro() {
    this.isRunning = true;
    let loop = 0;
    
    while (this.isRunning && (this.currentSequence.loopCount === 0 || loop < this.currentSequence.loopCount)) {
      for (const action of this.currentSequence.actions) {
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

  public async save() {
    await this.service.saveMacro(this.currentSequence);
  }

  public async load(id: string) {
    const seq = await this.service.loadMacro(id);
    if (seq) this.currentSequence = seq;
  }
}
