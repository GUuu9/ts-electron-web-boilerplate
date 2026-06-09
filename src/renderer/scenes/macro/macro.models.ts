// MacroScene에 필요한 기본 매크로 액션 타입 정의
export type MacroActionType = 'CLICK' | 'KEY_INPUT' | 'WAIT';

export interface MacroAction {
  type: MacroActionType;
  params: any;
  delayBeforeMs?: number;
  condition?: {
    type: 'IMAGE_MATCH';
    targetImage: string; // 이미지 식별자
  };
}

export interface MacroSequence {
  id: string;
  name: string;
  actions: MacroAction[];
  loopCount: number; // 0은 무한 반복
}
