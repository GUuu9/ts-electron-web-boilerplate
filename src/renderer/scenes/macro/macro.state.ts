import { BaseState } from '../../data/operationData/base.state.js';
import { MacroSequence } from './macro.models.js';

/**
 * MacroState
 * Macro 관련 상태를 관리합니다.
 */
export class MacroState extends BaseState {
  private _isRunning = false;
  private _currentSequence: MacroSequence = { id: 'default', name: 'New Macro', actions: [], loopCount: 1 };
  private _currentActionIndex = -1;

  get isRunning() { return this._isRunning; }
  set isRunning(value: boolean) {
    if (this._isRunning !== value) {
      this._isRunning = value;
      this.notify();
    }
  }

  get currentSequence() { return this._currentSequence; }
  set currentSequence(value: MacroSequence) {
    this._currentSequence = value;
    this.notify();
  }

  get currentActionIndex() { return this._currentActionIndex; }
  set currentActionIndex(value: number) {
    if (this._currentActionIndex !== value) {
      this._currentActionIndex = value;
      this.notify();
    }
  }
}
