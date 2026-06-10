import { MacroSceneService } from './macroTest.service.js';
import { MacroSequence, MacroAction } from './macro.models.js';

export class MacroViewModel {
  private isRunning = false;
  private currentSequence: MacroSequence = { id: 'default', name: 'New Macro', actions: [], loopCount: 1 };
  private currentActionIndex = -1;
  private onStatusChanged: ((index: number) => void) | null = null;

  constructor(private service: MacroSceneService) {}

  public getSequence() { return this.currentSequence; }
  
  public setSequence(seq: MacroSequence) { this.currentSequence = seq; }

  public setStatusChangeListener(listener: (index: number) => void) {
    this.onStatusChanged = listener;
  }

  public addAction(action: MacroAction) {
    this.currentSequence.actions.push(action);
  }

  public removeAction(index: number) {
    this.currentSequence.actions.splice(index, 1);
  }

  public reorderAction(oldIndex: number, newIndex: number) {
    const actions = this.currentSequence.actions;
    const [movedItem] = actions.splice(oldIndex, 1);
    actions.splice(newIndex, 0, movedItem);
  }

  public async runMacro() {
    this.isRunning = true;
    let loop = 0;
    
    while (this.isRunning && (this.currentSequence.loopCount === 0 || loop < this.currentSequence.loopCount)) {
      for (let i = 0; i < this.currentSequence.actions.length; i++) {
        if (!this.isRunning) break;
        
        this.currentActionIndex = i;
        if (this.onStatusChanged) this.onStatusChanged(i);

        const action = this.currentSequence.actions[i];
        await this.service.executeAction(action);
        if (action.delayBeforeMs) await new Promise(r => setTimeout(r, action.delayBeforeMs));
      }
      loop++;
    }
    
    this.currentActionIndex = -1;
    if (this.onStatusChanged) this.onStatusChanged(-1);
    this.isRunning = false;
  }

  public stopMacro() {
    this.isRunning = false;
  }

  public async getMousePosition(): Promise<{ x: number, y: number } | null> {
    return await this.service.getMousePosition();
  }

  public async save() {
    await this.service.saveMacro(this.currentSequence);
  }

  public async load() {
    const seq = await this.service.loadMacro();
    if (seq) {
      this.currentSequence = seq;
      return true;
    }
    return false;
  }
}
