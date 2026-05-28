# 기능 추가 개발자 가이드

이 문서는 본 프로젝트의 아키텍처 규칙에 따라 새로운 기능을 추가하는 단계를 상세히 설명합니다.

---

## 1. 개요
프로젝트는 크게 세 계층으로 나뉩니다:
- **Backend (Main)**: `src/main/`
- **Frontend (Renderer)**: `src/renderer/`
- **Shared (Common)**: `src/shared/`

새로운 기능을 추가할 때는 각 계층에 맞게 모듈을 생성하고, 마지막으로 **Registry**를 통해 의존성을 조립합니다.

---

## 2. 단계별 구현 절차

### 1단계: 백엔드 모듈 구현 (Backend)
백엔드 로직이 필요하다면 `src/main/features/` 아래에 도메인별 폴더를 생성합니다.

1.  **Service 작성**: `*.server.ts` 또는 독립 클래스를 작성합니다.
2.  **Core 모듈 작성**: `*.core.ts` 파일을 생성하고 `BackendModule` 인터페이스를 구현합니다.
3.  **IPC 핸들러 등록**: `setupHandlers()` 내부에 `ipcMain.handle`을 작성합니다.
4.  **브릿지 정의**: `src/main/features/.../*.bridge.ts`를 작성하여 렌더러에 노출할 API를 정의합니다.
5.  **preload 노출**: `src/main/preload.ts`에 해당 브릿지를 추가합니다.

### 2단계: 데이터 계층 구현 (Renderer Data)
렌더러에서 백엔드 데이터를 가져오거나 로컬 데이터를 다루는 리포지토리를 만듭니다.

1.  **Repository 작성**: `src/renderer/data/[domain]/[service]/[name].repository.ts`를 생성합니다.
2.  **IPC 호출**: `window.electronAPI`를 통해 백엔드 브릿지를 호출하는 메서드를 작성합니다.

### 3단계: MVVM 구현 (Renderer Features)
UI 로직을 처리하는 ViewModel과 View를 만듭니다.

1.  **ViewModel 작성**: `src/renderer/features/[domain]/[name].viewmodel.ts`를 생성합니다. 생성자를 통해 `Repository`를 주입받습니다.
2.  **View 작성**: `src/renderer/features/[domain]/[name].view.ts`를 생성합니다. 템플릿(HTML)을 정의하고 `elements` getter를 통해 DOM 요소에 접근합니다.
3.  **Binder 작성**: 같은 파일 내에 `Binder` 클래스를 생성합니다. `View`의 DOM 요소에 이벤트를 바인딩하고 `ViewModel`의 메서드를 호출합니다.

### 4단계: 의존성 조립 (Registry)
마지막으로 `src/renderer/core/di/registry.ts`에서 새로운 모듈을 조립합니다.

```typescript
// 예시
const repository = new DomainRepository(service);
const viewModel = new DomainViewModel(repository);
const view = new DomainView();
const binder = new DomainBinder(view, viewModel);

binder.bind(); // 초기화
```

---

## 💡 개발 시 주의사항

1.  **순수성 유지**: `View`는 비즈니스 로직을 직접 수행하지 않습니다. 모든 요청은 `ViewModel`을 통과해야 합니다.
2.  **주석의 중요성**: 코드의 의도와 비즈니스 로직의 흐름을 설명하는 주석은 절대 삭제하지 마십시오.
3.  **경로 규칙**: 
    - 공유 로직은 `src/shared/`에 위치합니다.
    - 렌더러 프로세스에서 `src/main/` 경로를 절대 `import`하지 마십시오. 오직 IPC 통신만 허용됩니다.
4.  **단일 책임**: 한 파일이 너무 커지면(예: 300라인 이상), 도메인을 더 잘게 쪼개어 폴더를 분리하십시오.
