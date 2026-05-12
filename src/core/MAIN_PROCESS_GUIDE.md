# 🖥 Electron Main Process 가이드

이 프로젝트의 메인 프로세스는 최소한의 오케스트레이션만 담당하며, 실제 기능은 `src/features` 폴더 내의 **CoreFeature** 모듈들이 담당합니다.

## 🏗 모듈러 아키텍처

이 프로젝트는 기능을 유연하게 추가하고 삭제하기 위해 `CoreRegistry`를 통한 플러그인 방식을 사용합니다.

### 1. 기능 등록 (Registration)
새로운 기능을 추가하거나 기존 기능을 삭제할 때 `main.ts`의 등록 리스트만 수정하면 됩니다.

```typescript
// src/main.ts
coreRegistry.register(new NetworkCoreFeature()); // 추가
// coreRegistry.register(new OldFeature());      // 삭제 시 이 줄만 제거
```

### 2. CoreFeature 구조
각 기능은 `CoreFeature` 인터페이스를 구현하여 자신의 IPC 핸들러와 라이프사이클을 관리합니다.

- `setupHandlers()`: `ipcMain` 핸들러 등록
- `onWindowCreated()`: 메인 창 생성 시 이벤트 바인딩 (장치 권한 등)
- `init()`: 앱 시작 시 필요한 초기화

## 🛠 새로운 기능 추가 절차

1. **Feature 구현**: `src/features/[domain]` 폴더를 생성하고 `[domain].core.ts` 파일에서 `CoreFeature`를 구현합니다.
2. **Bridge 정의**: `src/core/bridge/[domain].bridge.ts` 파일에서 Renderer에 노출할 API를 정의합니다.
3. **등록**: `src/main.ts`에 모듈을 등록하고, `src/preload.ts`에서 생성한 브릿지를 합칩니다.

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
