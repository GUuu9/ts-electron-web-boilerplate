# 🌉 Preload Bridge 개발 가이드

이 문서는 메인 프로세스(Node.js)의 기능을 렌더러 프로세스(웹 화면)에 안전하게 노출하기 위한 **Bridge** 작성 표준을 설명합니다.

---

## 🏗 설계 원칙

1. **보안(Security)**: 렌더러가 Node.js API(`ipcRenderer` 등)에 직접 접근하지 못하도록 `contextBridge`를 통해 제한된 함수만 노출합니다.
2. **모듈화(Modularity)**: 도메인별(Network, Device 등)로 브릿지 파일을 분리하여 관리합니다.
3. **일관성(Consistency)**: 비동기 요청은 `invoke`, 단방향 알림은 `send`, 이벤트 수신은 `on` 패턴을 사용합니다.

---

## 🛠 브릿지 작성 및 등록 절차

### 1단계: 브릿지 파일 생성
`src/core/bridge/` 폴더에 `[도메인].bridge.ts` 파일을 생성합니다.

```typescript
// src/core/bridge/example.bridge.ts
import { ipcRenderer } from 'electron';

export const exampleBridge = {
  example: {
    // 1. 비동기 요청 (Main의 ipcMain.handle과 연결)
    doTask: (data: any) => ipcRenderer.invoke('example-task', data),

    // 2. 단방향 명령 (Main의 ipcMain.on과 연결)
    sendNotice: (msg: string) => ipcRenderer.send('example-notice', msg),

    // 3. 이벤트 수신 (Main의 webContents.send와 연결)
    onUpdate: (callback: (data: any) => void) => {
      // 중요: 중복 리스너 방지를 위해 먼저 제거
      ipcRenderer.removeAllListeners('example-update');
      ipcRenderer.on('example-update', (_event, data) => callback(data));
    }
  }
};
```

### 2단계: Preload에 등록
`src/preload.ts` 파일에서 생성한 브릿지를 가져와 합칩니다.

```typescript
// src/preload.ts
import { exampleBridge } from './core/bridge/example.bridge.js';

contextBridge.exposeInMainWorld('electronAPI', {
  ...networkBridge,
  ...exampleBridge, // 추가
  // ...
});
```

---

## ⚠️ 주의 사항

1. **리스너 정리**: `onXXX`와 같은 이벤트 수신 함수를 만들 때는 반드시 `ipcRenderer.removeAllListeners()`를 호출하여 메모리 누수와 중복 실행을 방지해야 합니다.
2. **단순 전달**: 브릿지 파일 안에서는 복잡한 로직을 작성하지 마십시오. 오직 IPC 통로 역할만 수행해야 합니다.
3. **타입 정의**: 렌더러에서 사용할 때 타입 힌트가 필요하다면 `src/renderer/src/main.ts`의 `declare global` 섹션에 해당 브릿지의 타입을 추가하십시오.

---

## 📂 현재 운영 중인 브릿지
- `network.bridge.ts`: HTTP, TCP, UDP, Socket 서버 제어
- `device.bridge.ts`: 블루투스, USB, HID 장치 선택
- `logger.bridge.ts`: 감사 로그 기록 및 외부 로그 창 제어
- `system.bridge.ts`: 시스템 상태, 영구 저장소, OS 알림
