import { BaseState } from '../../data/operationData/base.state.js';

/**
 * AIState
 * AI 관련 상태를 관리합니다.
 */
export class AIState extends BaseState {
  private _isActive = false;
  private _memory: { distance: number, bias: number }[] = [];

  get isActive() { return this._isActive; }
  set isActive(value: boolean) {
    if (this._isActive !== value) {
      this._isActive = value;
      this.notify();
    }
  }

  get memory() { return this._memory; }
  set memory(value: { distance: number, bias: number }[]) {
    this._memory = value;
    this.notify();
  }
}
