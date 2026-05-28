import { AICore } from './ai.core.js';

export interface AIRunnerConfig {
  mode: 'frame' | 'time';
  value: number; // frame mode: frames per tick, time mode: milliseconds per tick
}

/**
 * 행동 트리 엔진의 실행 루프를 관리하는 클래스입니다.
 * 설정에 따라 프레임 단위 또는 시간 단위로 tick을 수행합니다.
 */
export class AIRunner {
  private animationFrameId: number | null = null;
  private lastTickTime: number = 0;
  private frameCount: number = 0;

  constructor(
    private aiCore: AICore,
    private config: AIRunnerConfig = { mode: 'time', value: 5000 }
    //private config: AIRunnerConfig = { mode: 'frame', value: 1 }
  ) {}

  /**
   * AI 실행 루프를 시작합니다.
   */
  start(): void {
    if (this.animationFrameId !== null) return;

    this.lastTickTime = performance.now();
    this.frameCount = 0;

    const loop = (currentTime: number) => {
      let shouldTick = false;

      if (this.config.mode === 'frame') {
        this.frameCount++;
        if (this.frameCount >= this.config.value) {
          shouldTick = true;
          this.frameCount = 0;
        }
      } else {
        const deltaTime = currentTime - this.lastTickTime;
        if (deltaTime >= this.config.value) {
          shouldTick = true;
          this.lastTickTime = currentTime;
        }
      }

      if (shouldTick) {
        this.aiCore.tickAll();
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * AI 실행 루프를 중지합니다.
   */
  stop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * 런타임에 설정을 변경합니다.
   */
  setConfig(config: AIRunnerConfig): void {
    this.config = config;
    this.frameCount = 0;
    this.lastTickTime = performance.now();
  }
}
