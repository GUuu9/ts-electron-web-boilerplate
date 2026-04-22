# 💻 OS Integration 가이드

이 모듈은 데스크탑 운영체제(Windows, macOS, Linux)와의 깊은 연동 기능을 제공합니다.

## 🛠 제공 기능

| 기능 | 단축키 / 프로토콜 | 설명 |
| :--- | :--- | :--- |
| **System Tray** | - | 아이콘 우클릭 메뉴 및 창 토글 지원 |
| **Notification** | - | OS 표준 알림 센터를 통한 메시지 발송 |
| **Global Shortcut** | **Mac: ⌘⇧X / Win: Alt+Shift+X** | 어떤 환경에서도 앱 창을 즉시 표시/숨김 |
| **Deep Link** | `my-app://` | 브라우저나 외부 앱에서 우리 앱의 특정 기능 호출 |

---

## 🏗 아키텍처 구조

1.  **Service**: `src/core/os/os-integration.service.ts` (Tray, globalShortcut, Notification API 사용)
2.  **IPC Handler**: `src/main.ts` (`os-notify` 등)
3.  **Bridge**: `src/preload.ts` (`window.electronAPI.os`)
4.  **Controller**: `src/renderer/src/features/maintenance/maintenance.controller.ts`

---

## 🚀 사용 방법 (How to use)

### 1. 알림 보내기 (Renderer)
```typescript
window.electronAPI.os.notify('제목', '내용입니다.');
```

### 2. 딥 링크 처리 (Renderer)
앱 내에서 딥 링크가 수신되었을 때 특정 로직을 수행하려면 다음과 같이 리스너를 등록합니다.
```typescript
window.electronAPI.os.onDeepLink((url) => {
  console.log('Deep link received:', url);
});
```

---

## ⚠️ 주의 사항
- **아이콘**: 현재 데모를 위해 빈 이미지(`nativeImage.createEmpty()`)를 사용 중입니다. 실제 배포 시에는 `build/icon.png` 등의 실제 파일 경로를 `Tray` 생성자에 전달해야 합니다.
- **종료 정책**: 창의 `X` 버튼을 눌러도 앱이 완전히 종료되지 않고 트레이로 숨겨집니다. 앱을 완전히 종료하려면 **트레이 메뉴의 '종료'**를 선택해야 합니다.
