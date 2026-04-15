# 🔌 Device Control 가이드

이 모듈은 블루투스, USB, HID, 미디어(마이크/헤드셋) 장치를 연결하고 제어하는 인프라 계층입니다.

## 🛠 제공 서비스

| 서비스 | 지원 API | 주요 용도 |
| :--- | :--- | :--- |
| **BluetoothService** | Web Bluetooth | 블루투스 LE 장치 검색 및 통신 |
| **UsbService** | WebUSB / WebHID | 전용 USB 기기, 게임패드, 커스텀 컨트롤러 연결 |
| **MediaService** | MediaDevices | 마이크, 헤드셋 목록 확인 및 오디오 스트림 획득 |

---

## 🚀 사용 방법 (How to use)

### 1. BluetoothService (블루투스)
```typescript
const bt = container.get<BluetoothService>('BluetoothService');
const device = await bt.requestDevice(); // 장치 선택 창 활성화
if (device) {
  await bt.connect();
  console.log('Connected to:', device.name);
}
```

### 2. UsbService (USB/HID/컨트롤러)
```typescript
const usb = container.get<UsbService>('UsbService');

// USB 장치 요청
const device = await usb.requestUsbDevice();

// 게임패드 버튼 상태 확인
const gamepads = usb.getGamepads();
if (gamepads[0]) {
  console.log('Gamepad 0 버튼 0 상태:', gamepads[0].buttons[0].pressed);
}
```

### 3. MediaService (마이크/헤드셋)
```typescript
const media = container.get<MediaService>('MediaService');

// 사용 가능한 장치 리스트 출력
const devices = await media.enumerateDevices();
devices.forEach(d => console.log(`${d.kind}: ${d.label}`));

// 마이크 스트림 가져오기
const stream = await media.getAudioStream();
```

---

## ⚠️ OS별 필수 설정 (Electron)

### macOS / Windows 권한
Electron 환경에서 블루투스나 USB에 접근하려면 메인 프로세스(`src/main.ts`)에서 다음 처리가 이미 구현되어 있습니다:
1. `select-bluetooth-device` 이벤트 핸들링 (장치 선택 허용)
2. `session.setPermissionCheckHandler` (권한 체크 통과)
3. `session.setDevicePermissionHandler` (장치 사용 승인)

### 웹 브라우저
브라우저 환경(Chrome/Edge 등)에서는 반드시 **HTTPS** 환경이거나 **localhost**에서만 작동하며, 사용자의 명시적인 클릭(Gesture) 후에만 장치 선택 창을 띄울 수 있습니다.
