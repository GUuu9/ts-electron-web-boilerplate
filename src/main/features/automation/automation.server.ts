import { mouse, keyboard, Key, Button, sleep } from "@nut-tree-fork/nut-js";

/**
 * Automation Server: 하위 수준의 입력 제어 서비스
 */
export class AutomationServer {
  constructor() {}

  public async moveMouse(x: number, y: number): Promise<void> {
    await mouse.setPosition({ x, y });
  }

  public async getMousePosition(): Promise<{ x: number, y: number }> {
    const pos = await mouse.getPosition();
    return { x: pos.x, y: pos.y };
  }

  public async clickMouse(button: 'left' | 'right' | 'middle', durationMs?: number): Promise<void> {
    const btn = button === 'left' ? Button.LEFT : button === 'right' ? Button.RIGHT : Button.MIDDLE;
    if (durationMs) {
      await mouse.pressButton(btn);
      await sleep(durationMs);
      await mouse.releaseButton(btn);
    } else {
      await mouse.click(btn);
    }
  }

  public async doubleClickMouse(): Promise<void> {
    await mouse.doubleClick(Button.LEFT);
  }

  public async scrollMouse(amount: number): Promise<void> {
    if (amount > 0) await mouse.scrollUp(amount);
    else await mouse.scrollDown(Math.abs(amount));
  }

  public async dragMouse(fromX: number, fromY: number, toX: number, toY: number): Promise<void> {
    await mouse.setPosition({ x: fromX, y: fromY });
    await mouse.drag([{ x: toX, y: toY }]);
  }

  public async typeText(text: string): Promise<void> {
    await keyboard.type(text);
  }

  public async pressKey(key: string, durationMs?: number): Promise<void> {
    const keyMap: Record<string, Key> = {
      'backspace': Key.Backspace, 'tab': Key.Tab, 'enter': Key.Enter, 'escape': Key.Escape,
      'space': Key.Space, 'pageup': Key.PageUp, 'pagedown': Key.PageDown, 'end': Key.End,
      'home': Key.Home, 'left': Key.Left, 'up': Key.Up, 'right': Key.Right, 'down': Key.Down,
      'insert': Key.Insert, 'delete': Key.Delete,
      '0': Key.Num0, '1': Key.Num1, '2': Key.Num2, '3': Key.Num3, '4': Key.Num4,
      '5': Key.Num5, '6': Key.Num6, '7': Key.Num7, '8': Key.Num8, '9': Key.Num9,
      'a': Key.A, 'b': Key.B, 'c': Key.C, 'd': Key.D, 'e': Key.E, 'f': Key.F,
      'g': Key.G, 'h': Key.H, 'i': Key.I, 'j': Key.J, 'k': Key.K, 'l': Key.L,
      'm': Key.M, 'n': Key.N, 'o': Key.O, 'p': Key.P, 'q': Key.Q, 'r': Key.R,
      's': Key.S, 't': Key.T, 'u': Key.U, 'v': Key.V, 'w': Key.W, 'x': Key.X,
      'y': Key.Y, 'z': Key.Z,
      'f1': Key.F1, 'f2': Key.F2, 'f3': Key.F3, 'f4': Key.F4, 'f5': Key.F5,
      'f6': Key.F6, 'f7': Key.F7, 'f8': Key.F8, 'f9': Key.F9, 'f10': Key.F10,
      'f11': Key.F11, 'f12': Key.F12,
      'cmd': Key.LeftCmd, 'ctrl': Key.LeftControl, 'alt': Key.LeftAlt, 'shift': Key.LeftShift,
    };

    const targetKey = keyMap[key.toLowerCase()];
    if (!targetKey) {
      console.warn(`[Automation] 알 수 없는 키: ${key}`);
      return;
    }

    if (durationMs) {
      await keyboard.pressKey(targetKey);
      await sleep(durationMs);
      await keyboard.releaseKey(targetKey);
    } else {
      await keyboard.pressKey(targetKey);
      await keyboard.releaseKey(targetKey);
    }
  }
}
