// MacroScene에 필요한 기본 매크로 액션 타입 정의
export type MacroActionType = 'CLICK' | 'KEY_INPUT' | 'WAIT';

export interface MacroAction {
  type: MacroActionType;
  params: {
    x?: number; // Click
    y?: number; // Click
    text?: string; // KeyInput
    key?: string; // KeyInput
    durationMs?: number; // KeyInput(Hold) / Wait
    targetImage?: string; // Image Condition
  };
  delayBeforeMs?: number;
}

export interface MacroSequence {
  id: string;
  name: string;
  actions: MacroAction[];
  loopCount: number; // 0은 무한 반복
}
