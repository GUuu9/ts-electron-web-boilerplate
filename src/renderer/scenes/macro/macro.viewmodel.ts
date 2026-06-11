import { MacroSceneService } from './macroTest.service.js';
import { MacroSequence, MacroAction } from './macro.models.js';
import { MacroState } from './macro.state.js';

export class MacroViewModel {
  public readonly state = new MacroState();

  constructor(private service: MacroSceneService) {}

  /**
   * ViewModel을 초기화하고 현재 시퀀스 데이터를 반환합니다.
   * View가 렌더링될 때 호출되어 최신 상태를 화면에 반영합니다.
   */
  public init(): MacroSequence {
    return this.state.currentSequence;
  }

  public getSequence() { return this.state.currentSequence; }
  
  public setSequence(seq: MacroSequence) { this.state.currentSequence = seq; }

  public addAction(action: MacroAction) {
    const seq = { ...this.state.currentSequence };
    seq.actions.push(action);
    this.state.currentSequence = seq;
  }

  public removeAction(index: number) {
    const seq = { ...this.state.currentSequence };
    seq.actions.splice(index, 1);
    this.state.currentSequence = seq;
  }

  public reorderAction(oldIndex: number, newIndex: number) {
    const seq = { ...this.state.currentSequence };
    const [movedItem] = seq.actions.splice(oldIndex, 1);
    seq.actions.splice(newIndex, 0, movedItem);
    this.state.currentSequence = seq;
  }

  public async runMacro() {
    this.state.isRunning = true;
    let loop = 0;
    
    while (this.state.isRunning && (this.state.currentSequence.loopCount === 0 || loop < this.state.currentSequence.loopCount)) {
      for (let i = 0; i < this.state.currentSequence.actions.length; i++) {
        if (!this.state.isRunning) break;
        
        this.state.currentActionIndex = i;

        const action = this.state.currentSequence.actions[i];
        await this.service.executeAction(action);
        if (action.delayBeforeMs) await new Promise(r => setTimeout(r, action.delayBeforeMs));
      }
      loop++;
    }
    
    this.state.currentActionIndex = -1;
    this.state.isRunning = false;
  }

  public stopMacro() {
    this.state.isRunning = false;
  }

  public async getMousePosition(): Promise<{ x: number, y: number } | null> {
    return await this.service.getMousePosition();
  }

  public async save() {
    await this.service.saveMacro(this.state.currentSequence);
  }

  public async load() {
    const seq = await this.service.loadMacro();
    if (seq) {
      this.state.currentSequence = seq;
      return true;
    }
    return false;
  }
}
