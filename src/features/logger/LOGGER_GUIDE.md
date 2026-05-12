# 🛡 Logger & Safety 가이드

이 프로젝트는 시스템의 주요 동작을 기록하는 `AuditLogger`와 실시간 인터랙티브 로깅을 위한 `UILogger`를 운영합니다.

---

## 🖥 UI Logger (실시간 모니터링)

`UILogger`는 사용자가 앱의 동작을 실시간으로 확인하고 제어할 수 있는 고급 로깅 인터페이스를 제공합니다.

### 1. 주요 기능
- **플로팅 모드 (Floating)**: 화면 어디로든 드래그하여 이동시키고, 우측 하단 핸들로 크기를 조절할 수 있습니다.
- **도킹 모드 (Docked)**: 화면 하단에 꽉 차게 고정하여 안정적으로 로그를 확인합니다. 도킹 시 메인 콘텐츠가 가려지지 않도록 레이아웃이 자동 조절됩니다.
- **최소화 (Minimize)**: 로그 확인이 필요 없을 때 헤더만 남기고 작게 접어둘 수 있습니다.
- **외부 창 분리 (Detach)**: 데스크탑 환경에서 별도의 OS 윈도우로 로그 창을 분리하여 멀티 모니터 환경에서 활용할 수 있습니다.

### 2. 조작 방법 및 커맨드
| 기능 | 방법 / 커맨드 | 설명 |
| :--- | :--- | :--- |
| **모드 전환** | `/logger-mode` | 플로팅 ↔ 도킹 모드 전환 |
| **단축키** | **Cmd/Ctrl + Shift + L** | UI 로거 도킹 모드 즉시 전환 |
| **로그 초기화** | `/clear` | 현재 로그 패널의 내용을 모두 삭제 |
| **도움말** | `/help` | 사용 가능한 모든 커맨드 목록 표시 |
| **외부 분리** | 헤더의 `Detach` 버튼 | 별도의 새 창으로 로그 창 분리 (Desktop 전용) |

---

## 🛡 Audit Logger (시스템 감사)

`AuditLogger`는 하드웨어 제어 및 보안 관련 중요 이벤트를 영구 파일로 기록합니다.

### 1. 로깅 원칙
1. **중앙 집중식 기록**: 하드웨어 제어 및 주요 동작은 `AuditLogger`를 통해 파일(`audit.log`)에 기록됩니다.
2. **일반 텍스트 저장**: 관리 편의를 위해 암호화 없이 일반 텍스트로 기록합니다.

### 2. 📂 로그 파일 저장 위치
`AuditLogger`는 각 운영체제별 표준 데이터 저장 경로(userData)에 `audit.log` 파일을 생성합니다.

- **macOS**: `~/Library/Application Support/ts-electron-web-boilerplate/audit.log`
- **Windows**: `%APPDATA%\ts-electron-web-boilerplate\audit.log`
- **Linux**: `~/.config/ts-electron-web-boilerplate/audit.log`

---

## 🚀 사용 방법 (Shared)

```typescript
// Renderer에서 UI 로그 출력
window.uiLogger.log('Network connected successfully');

// Main에서 Audit 로그 기록
const audit = container.get<AuditLogger>('AuditLogger');
audit.record('SYSTEM_STARTUP');
```

