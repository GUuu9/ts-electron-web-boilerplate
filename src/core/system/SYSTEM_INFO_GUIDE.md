# 📊 System Info Service 가이드

이 서비스는 호스트 OS의 리소스 사용량(CPU, 메모리)과 앱의 실행 상태 정보를 수집하여 제공합니다. 주로 유지보수(Maintenance) 및 성능 모니터링 목적으로 사용됩니다.

## 🛠 제공 기능

| 메서드 | 반환 데이터 | 용도 |
| :--- | :--- | :--- |
| **getStatus()** | CPU 모델, 코어 수, 메모리 사용량, 업타임 등 | 실시간 시스템 리소스 모니터링 |

## 🏗 아키텍처 구조

1.  **Service**: `src/core/system/system-info.service.ts` (Node.js os 모듈 활용)
2.  **IPC Handler**: `src/main.ts` (`get-system-status` 핸들러)
3.  **Bridge**: `src/preload.ts` (`window.electronAPI.maintenance.getSystemStatus`)
4.  **Controller**: `src/renderer/src/features/maintenance/maintenance.controller.ts`

---

## 🚀 사용 방법 (How to use)

### 1. 메인 프로세스에서 직접 사용
```typescript
import { container } from '../core/di/container.main.js';
const systemInfo = container.get<SystemInfoService>('SystemInfoService');
console.log(systemInfo.getStatus());
```

### 2. 렌더러 프로세스에서 호출 (IPC 브릿지)
```typescript
const status = await window.electronAPI.maintenance.getSystemStatus();
console.log('CPU:', status.cpuModel);
console.log('Memory Usage:', status.memoryPercentage, '%');
```

---

## 📋 반환 데이터 상세 (Status Object)

```json
{
  "platform": "darwin",
  "arch": "arm64",
  "cpuModel": "Apple M1 Max",
  "cpuCount": 10,
  "totalMemory": "32.00 GB",
  "usedMemory": "12.45 GB",
  "memoryPercentage": "38.91",
  "uptime": "2h 15m 30s",
  "appVersion": "1.0.0",
  "nodeVersion": "v22.2.0"
}
```

---

## ⚠️ 주의 사항
- **Node.js 의존성**: 이 서비스는 `os` 및 `process` 모듈을 사용하므로 오직 **Main 프로세스**에서만 인스턴스화될 수 있습니다. 렌더러에서는 반드시 IPC 브릿지를 통해 접근하십시오.
- **업데이트 주기**: `getStatus()`는 호출 시점의 스냅샷을 반환합니다. 실시간 변화를 관찰하려면 `setInterval`을 통해 주기적으로 호출해야 합니다 (기본 권장 주기: 2초).
