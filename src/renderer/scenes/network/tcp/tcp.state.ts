import { BaseState } from '../../../data/operationData/base.state.js';

/**
 * TcpState
 * TCP 관련 상태를 관리합니다.
 */
export class TcpState extends BaseState {
  private _isServerRunning = false;
  private _isClientConnected = false;

  get isServerRunning() { return this._isServerRunning; }
  set isServerRunning(value: boolean) {
    if (this._isServerRunning !== value) {
      this._isServerRunning = value;
      this.notify();
    }
  }

  get isClientConnected() { return this._isClientConnected; }
  set isClientConnected(value: boolean) {
    if (this._isClientConnected !== value) {
      this._isClientConnected = value;
      this.notify();
    }
  }
}
