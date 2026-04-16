# 🏗 Dependency Injection (DI) 가이드

이 모듈은 애플리케이션의 의존성 주입(DI)과 객체 생명주기를 중앙에서 관리하는 핵심 인프라입니다. **플랫폼별 의존성 격리를 위해 Main(Node.js)용 컨테이너와 Renderer(Browser)용 컨테이너가 물리적으로 분리되어 있습니다.**

## 💡 설계 원칙

1. **배럴 파일(`index.ts`) 금지**: 사이드 이펙트 방지를 위해 모든 서비스는 개별 파일 경로로 직접 임포트합니다.
2. **컨테이너 분리**:
   - **`container.main.ts`**: Node.js 전용 모듈(TCP, UDP)을 포함한 모든 서버 인프라 관리. (Electron Main Process에서만 사용)
   - **`container.renderer.ts`**: 브라우저 환경에서 안전한 서비스(HTTP, Socket, Device, Shared)만 관리. (Renderer Process에서 사용)

---

## 🚀 사용 방법 (How to use)

### 1. 컨테이너 선택
작업 중인 프로세스 환경에 맞는 컨테이너를 임포트하세요.

- **Main Process**: `import { container } from '../core/di/container.main.js';`
- **Renderer Process**: `import { container } from '../../../../core/di/container.renderer.js';`

### 2. 의존성 등록
새로운 기능을 추가할 때 해당 환경의 컨테이너 파일에 인스턴스를 등록하세요. **주의: Renderer 컨테이너에는 Node.js 전용 모듈을 절대 등록하지 마십시오.**

### 3. 인스턴스 사용
필요한 곳에서 `container.get()`을 통해 인스턴스를 가져옵니다.

```typescript
// 렌더러 프로세스 예시
import { container } from '../../../../core/di/container.renderer.js';

const calcController = container.get<CalcController>('CalcController');
```

---

## 📂 파일 구조

- `container.main.ts`: Main 프로세스 전용 DI 컨테이너 (Node.js 서비스 포함)
- `container.renderer.ts`: Renderer 프로세스 전용 DI 컨테이너 (Browser 서비스만 포함)

---

## ⚠️ 주의 사항
- Renderer 프로세스에서 `TcpClient`나 `UdpClient`가 필요하다면, 반드시 `main.ts`에서 IPC 핸들러를 구현하고 `electronAPI` 브릿지를 통해 접근하십시오.
- 모든 서비스는 환경에 맞는 컨테이너 파일에 명시적으로 임포트하여 등록하십시오.
