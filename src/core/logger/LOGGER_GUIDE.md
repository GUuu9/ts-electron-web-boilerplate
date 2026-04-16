# 🛡 Audit Logger & Safety 가이드

이 프로젝트는 안정성을 위해 시스템의 주요 동작을 기록하는 `AuditLogger`를 운영합니다.

## 💡 로깅 원칙
1. **중앙 집중식 기록**: 하드웨어 제어 및 주요 동작은 `AuditLogger`를 통해 파일(`audit.log`)에 기록됩니다.
2. **일반 텍스트 저장**: 관리 편의를 위해 암호화 없이 일반 텍스트로 기록합니다.

## 📂 로그 파일 저장 위치
`AuditLogger`는 각 운영체제별 표준 데이터 저장 경로(userData)에 `audit.log` 파일을 생성합니다.

- **macOS**: `~/Library/Application Support/ts-electron-web-boilerplate/audit.log`
- **Windows**: `%APPDATA%\ts-electron-web-boilerplate\audit.log`
- **Linux**: `~/.config/ts-electron-web-boilerplate/audit.log`

*참고: 위 경로는 `package.json`의 `name` 필드에 설정된 앱 이름에 따라 다를 수 있습니다.*

## 🚀 사용 방법
`MainDIContainer`에 주입된 `AuditLogger`를 사용합니다.

```typescript
import { container } from '../core/di/container.main.js';
import type { AuditLogger } from '../core/logger/audit-logger.service.js';

const audit = container.get<AuditLogger>('AuditLogger');
audit.record('USB Device Connected: My Keyboard');
```

