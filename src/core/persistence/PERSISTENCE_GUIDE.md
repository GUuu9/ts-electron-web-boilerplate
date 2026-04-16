# 💾 Persistence Service 가이드

이 서비스는 애플리케이션의 설정, 게임 진행도, 사용자 데이터 등을 **암호화하여 로컬 디스크에 영구 저장**하는 기능을 제공합니다.

## 💡 설계 원칙

1. **데이터 보안**: 모든 데이터는 저장 시 AES-256-CBC 알고리즘으로 암호화되어 일반 텍스트로 노출되지 않습니다.
2. **중앙 집중식 관리**: `PersistenceService`를 통해 데이터를 관리하여 파일 시스템 접근을 격리합니다.
3. **영속성**: `electron-store`를 사용하여 앱 삭제 후 재설치 시에도 데이터가 유지되는 경로(userData)에 저장합니다.

---

## 🚀 사용 방법 (How to use)

### 1. 서비스 주입
`MainDIContainer`에서 서비스가 등록되어 있는지 확인하고 가져옵니다.

```typescript
import { container } from '../core/di/container.main.js';
import type { PersistenceService } from '../core/persistence/persistence.service.js';

const db = container.get<PersistenceService>('PersistenceService');
```

### 2. 데이터 저장 (Set)
`set(key, value)` 메서드는 데이터를 JSON 문자열로 변환 후 암호화하여 저장합니다.

```typescript
const gameData = { level: 10, items: ['sword', 'shield'] };
db.set('user-progress', gameData);
```

### 3. 데이터 조회 (Get)
`get(key)` 메서드는 저장된 암호화 데이터를 불러와 복호화 후 객체로 반환합니다.

```typescript
const data = db.get('user-progress');
if (data) {
  console.log('Level:', data.level);
}
```

---

## ⚠️ 주의 사항

1. **메인 프로세스 전용**: 현재 `PersistenceService`는 Node.js 파일 시스템(`fs`, `electron-store`)에 의존하므로 반드시 **Main 프로세스**에서 사용하십시오.
2. **렌더러 프로세스 연동**: 렌더러에서 데이터를 저장해야 한다면, `main.ts`에 IPC 핸들러(`db-get`, `db-set`)를 구현하고 `electronAPI` 브릿지를 통해 호출하십시오.
3. **키 보안**: 현재 `secretKey`는 코드 내 하드코딩되어 있습니다. 운영 단계에서는 반드시 OS 키체인(Keytar)이나 환경변수를 통해 관리하십시오.
