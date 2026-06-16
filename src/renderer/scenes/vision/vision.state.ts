import { BaseState } from '../../data/operationData/base.state.js';

/**
 * VisionState
 * Vision 관련 상태를 관리합니다.
 */
export class VisionState extends BaseState {
  private _processedImage: string = '';
  private _status: string = 'Idle';
  private _templatePath: string = '';
  private _similarity: number = 0.8;
  private _matchResult: { found: boolean, x?: number, y?: number, confidence: number } | null = null;

  get processedImage() { return this._processedImage; }
  set processedImage(value: string) {
    if (this._processedImage !== value) {
      this._processedImage = value;
      this.notify();
    }
  }

  get status() { return this._status; }
  set status(value: string) {
    if (this._status !== value) {
      this._status = value;
      this.notify();
    }
  }

  get templatePath() { return this._templatePath; }
  set templatePath(value: string) {
    if (this._templatePath !== value) {
      this._templatePath = value;
      this.notify();
    }
  }

  get similarity() { return this._similarity; }
  set similarity(value: number) {
    if (this._similarity !== value) {
      this._similarity = value;
      this.notify();
    }
  }

  get matchResult() { return this._matchResult; }
  set matchResult(value: { found: boolean, x?: number, y?: number, confidence: number } | null) {
    this._matchResult = value;
    this.notify();
  }
}
