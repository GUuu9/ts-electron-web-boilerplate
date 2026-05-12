# 💾 Persistence Service 가이드

이 서비스는 애플리케이션의 설정, 게임 진행도, 사용자 데이터 등을 **암호화하여 로컬 디스크에 영구 저장**하는 기능을 제공합니다.

## 💡 설계 원칙

1. **데이터 보안**: 모든 데이터는 저장 시 **AES-256-GCM** 알고리즘으로 암호화됩니다.
2. **무결성 검증**: GCM 모드의 **Auth Tag(인증 태그)**를 사용하여 데이터의 위변조 여부를 복호화 시 자동으로 검증합니다.
3. **영속성**: `electron-store`를 사용하여 앱 재설치 시에도 데이터가 유지되는 경로(`userData`)에 저장됩니다.

---

## 🚀 사용 방법 (How to use)

### 1. Main 프로세스에서 사용
`MainDIContainer`에서 서비스를 가져와 직접 데이터를 제어합니다.

```typescript
import { container } from '../core/di/container.main.js';
const db = container.get<PersistenceService>('PersistenceService');

db.set('key', { data: 'value' });
const val = db.get('key');
```

### 2. Renderer 프로세스에서 사용 (UI)
보안 브릿지(`electronAPI.persistence`)를 통해 암호화 저장소에 접근합니다.

```typescript
// 데이터 저장
window.electronAPI.persistence.set('app-theme', 'light');

// 데이터 조회 (Async)
const theme = await window.electronAPI.persistence.get('app-theme');
```

---

## 🛠 보안 사양

- **Algorithm**: `aes-256-gcm`
- **Key Length**: 256-bit (32 bytes)
- **IV Length**: 96-bit (12 bytes, GCM Standard)
- **Format**: `IV(hex) : AuthTag(hex) : EncryptedData(hex)` 형식으로 콜론으로 구분하여 저장됩니다.

