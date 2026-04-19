# 🖥 Electron Main Process (`src/main.ts`) 가이드

이 문서는 프로젝트의 중추 역할을 하는 Electron 메인 프로세스(`src/main.ts`)의 구조, 역할 및 새로운 기능을 추가하는 표준 방법을 설명합니다.

---

## 💡 핵심 역할

`src/main.ts`는 Node.js 환경에서 실행되며 다음과 같은 핵심 책임을 갖습니다.

1.  **애플리케이션 생명주기 관리**: 앱의 시작(`ready`), 종료(`window-all-closed`), 활성화(`activate`) 등을 제어합니다.
2.  **윈도우 관리 (`BrowserWindow`)**: 렌더러(UI) 창을 생성하고, 보안 설정(Sandbox, Context Isolation)을 적용합니다.
3.  **IPC(Inter-Process Communication) 핸들링**: 렌더러 프로세스에서 보낸 요청을 받아 Node.js 전용 API(파일 시스템, 네트워크 소켓 등)를 실행하고 결과를 반환합니다.
4.  **하드웨어 및 보안 권한 제어**: 블루투스, USB, HID 장치에 대한 접근 권한을 승인하고 장치 선택 이벤트를 관리합니다.
5.  **의존성 주입(DI) 인프라 구동**: `container.main.ts`를 통해 서버급 서비스(TCP/UDP 서버 등)를 로드합니다.

---

## 🏗 주요 구조 분석

### 1. 환경 설정 및 서비스 로드
프로젝트는 ESM(ES Modules)을 사용하며, 실행 시 가장 먼저 환경 변수와 DI 서비스를 로드합니다.
```typescript
import { container } from './core/di/container.main.js';

// 메인 프로세스 전용 서비스들을 컨테이너에서 가져옴
const auditLogger = container.get<AuditLogger>('AuditLogger');
const tcpServer = container.get<TcpServer>('TcpServer');
```

### 2. 창 생성 및 보안 (`createWindow`)
보안을 위해 `contextIsolation: true`와 `sandbox: false`(또는 true)를 설정하며, `preload.js`를 통해 안전한 통로를 확보합니다.
```typescript
mainWindow = new BrowserWindow({
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false, // 보안을 위해 false 유지
    contextIsolation: true,  // 필수
  },
});
```

### 3. IPC 핸들러 (`setupIpcHandlers`)
렌더러와의 통신은 두 가지 방식으로 처리합니다.
-   **`ipcMain.handle`**: 비동기 작업 후 결과를 반환해야 할 때 (`invoke`와 짝)
-   **`ipcMain.on`**: 결과를 반환할 필요가 없는 단방향 알림이나 명령 전송 시

---

## ✍️ 작성 및 확장 방법 (Standard Workflow)

새로운 OS 수준의 기능(예: 파일 저장, 새로운 서버 모듈)을 추가할 때 다음 단계를 따르십시오.

### 1단계: Core Service 구현
`src/core/` 또는 `src/features/` 하위에 실제 로직을 담당하는 클래스를 작성합니다. (Node.js API 사용 가능)

### 2단계: DI 컨테이너 등록
`src/core/di/container.main.ts`에 해당 서비스를 등록합니다.

### 3단계: IPC 핸들러 등록 (`src/main.ts`)
`setupIpcHandlers` 함수 내부에 통신 창구를 개설합니다.
```typescript
// 예시: 파일 저장 기능 추가
ipcMain.handle('save-file', async (_, content: string) => {
  try {
    const service = container.get<FileService>('FileService');
    await service.save(content);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
```

### 4단계: Preload 브릿지 추가 (`src/preload.ts`)
렌더러에서 호출할 수 있도록 함수를 노출합니다.
```typescript
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (content: string) => ipcRenderer.invoke('save-file', content),
});
```

### 5단계: 렌더러에서 사용
```typescript
// Renderer Controller 내부
await window.electronAPI.saveFile('Hello World');
```

---

## ⚠️ 주의 사항 및 보안 원칙

1.  **비즈니스 로직 분리**: `main.ts` 파일 안에 직접 복잡한 로직을 작성하지 마십시오. 반드시 `Service` 클래스로 분리하고 `main.ts`에서는 호출만 담당(Controller 역할)하십시오.
2.  **보안 검증**: IPC 핸들러로 넘어온 인자값(URL, 경로 등)을 신뢰하지 마십시오. 서비스 계층에서 반드시 유효성 검사를 수행해야 합니다.
3.  **에러 전파**: `ipcMain.handle` 사용 시 내부에서 발생한 에러는 `try-catch`로 감싸서 객체 형태(`{ success: false, error: ... }`)로 반환하는 것이 안정적입니다.
4.  **UI 블로킹 방지**: 메인 프로세스에서 무거운 동기 작업(예: 대용량 파일 동기 읽기)을 수행하면 전체 앱 UI가 멈출 수 있습니다. 항상 비동기 API를 사용하십시오.
