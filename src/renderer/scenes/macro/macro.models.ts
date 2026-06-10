// MacroScene에 필요한 기본 매크로 액션 타입 정의
export type MacroActionType = 
  | 'CLICK'           // 왼쪽 클릭
  | 'RIGHT_CLICK'     // 오른쪽 클릭
  | 'DOUBLE_CLICK'    // 더블 클릭
  | 'MOVE'            // 마우스 이동
  | 'DRAG'            // 드래그 (시작점 -> 끝점)
  | 'KEY_INPUT'       // 텍스트 타이핑
  | 'KEY_PRESS'       // 단일 키/조합 키 입력
  | 'WAIT'            // 단순 대기
  | 'IMAGE_SEARCH'    // 이미지 찾기 및 클릭
  | 'SCROLL';         // 휠 스크롤

export interface MacroAction {
  type: MacroActionType;
  params: {
    x?: number;
    y?: number;
    toX?: number;       // For Drag
    toY?: number;       // For Drag
    text?: string;      // For Typing
    key?: string;       // For KeyPress (e.g., 'enter', 'ctrl+c')
    durationMs?: number;
    targetImage?: string; 
    scrollAmount?: number; // For Scroll
    timeoutMs?: number;    // For IMAGE_SEARCH (0이면 1회만 시도)
    actionOnSuccess?: 'NONE' | 'CLICK' | 'DOUBLE_CLICK' | 'MOVE';
    actionOnFailure?: 'CONTINUE' | 'STOP';
    similarity?: number;   // 0.0 ~ 1.0
  };
  delayBeforeMs?: number;
  description?: string; // 액션에 대한 사용자 메모
}

export interface MacroSequence {
  id: string;
  name: string;
  actions: MacroAction[];
  loopCount: number; // 0은 무한 반복
}
