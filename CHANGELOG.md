# 📜 변경 이력 (Changelog)

이 프로젝트의 모든 개발 단계와 주요 변경 사항을 기록합니다.

---

## 📅 2026년 4월 15일 (수)

### 1. 프로젝트 초기화 및 환경 구축
- **실행 명령어**:
  ```bash
  npm init -y
  npm install --save-dev typescript electron electron-builder vite vitest @types/node
  npx tsc --init
  mkdir -p src/core/database src/core/di src/core/network src/core/route src/features src/shared src/renderer/public src/renderer/src
  ```

### 2. Node.js 런타임 업그레이드 및 보안 패치
- **실행 명령어**:
  ```bash
  nvm install 22 && nvm use 22
  npm install --save-dev typescript@latest electron@latest vite@latest
  npm audit fix
  ```
- **변경 사양**: Node.js v20 -> **v22.22.2 (LTS)**

### 3. TypeScript 설정 최적화 (.json)
- **수정 파일**: `tsconfig.electron.json`
- **핵심 코드**:
  ```json
  // moduleResolution 에러 해결 및 최신 Node 환경 반영
  "module": "NodeNext",
  "moduleResolution": "NodeNext",
  ```

### 4. 의존성 주입(DI) 시스템 구현
- **수정 파일**: `src/core/di/container.ts`, `src/core/di/index.ts`
- **핵심 코드**:
  ```typescript
  // 싱글톤 컨테이너 구현
  export class DIContainer {
    private constructor() {
      const calcService = new CalcService();
      this.services.set('CalcService', calcService);
      this.services.set('CalcController', new CalcController(calcService));
    }
  }
  // 배럴 내보내기 (index.ts)
  export * from './container';
  ```

### 5. 환경 변수 및 보안 관리 구축
- **실행 명령어**: `npm install dotenv`
- **수정 파일**: `src/main.ts`, `.env`, `.gitignore`
- **핵심 코드**:
  ```typescript
  // main.ts 상단에 환경 변수 로드 추가
  import * as dotenv from 'dotenv';
  dotenv.config();
  ```

### 6. 멀티 플랫폼 빌드 명령어 고도화
- **수정 파일**: `package.json`
- **핵심 코드**:
  ```json
  "scripts": {
    "dist": "npm run build:web && npm run build:electron && electron-builder --mac --win --linux"
  }
  ```
