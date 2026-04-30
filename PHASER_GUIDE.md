# 🎮 Phaser.js 게임 개발 가이드

이 문서는 프로젝트의 Phaser.js 엔진 구조와 인프라 서비스(DI) 연동 방법을 설명합니다.

---

## 🏗 핵심 아키텍처

이 보일러플레이트는 Phaser의 **Scene** 시스템과 프로젝트의 **Dependency Injection(DI)** 컨테이너를 통합하여 관리합니다.

### 1. Phaser 인스턴스 관리 (`PhaserGame.ts`)
Phaser 엔진의 초기화 및 전역 설정(물리 엔진, 화면 크기 등)을 담당합니다.
- **경로**: `src/renderer/src/game/PhaserGame.ts`
- **역할**: 게임 설정 객체(GameConfig)를 정의하고 `new Phaser.Game(config)`을 통해 엔진을 기동합니다.

### 2. 씬(Scene) 개발 규약
모든 게임 씬은 `src/renderer/src/game/scenes/` 하위에 작성하며, 기본적으로 다음 구조를 따릅니다.

```typescript
import Phaser from 'phaser';
import { container } from '../../../core/di/container.renderer.js';

export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() {
    // DI 컨테이너에서 서비스 주입받기
    const socket = container.get<SocketClient>('SocketClient');
  }
}
```

---

## 🌐 인프라 서비스 연동 (DI)

게임 씬 내부에서 외부 통신이나 로컬 저장소 기능을 사용할 때 직접 인스턴스를 생성하지 않고, **Renderer DI Container**를 활용합니다.

### 사용 가능한 주요 서비스
- **SocketClient**: 멀티플레이 서버 연결 및 실시간 데이터 송수신.
- **HttpClient**: 외부 API 호출 (로그인, 랭킹 조회 등).
- **PersistenceService**: (Electron 한정) 게임 진행도 및 설정 암호화 저장.
- **Bluetooth/UsbService**: 하드웨어 컨트롤러 연동.

---

## 🛠 멀티플레이 구현 (Socket.io)

`MainScene.ts`에 구현된 예시를 바탕으로 멀티플레이 로직을 확장할 수 있습니다.

1.  **서버 연결**: `this.socketClient.connect(url)`
2.  **데이터 전송**: `this.socketClient.emit('player_move', { x, y })`
3.  **데이터 수신**: 
    ```typescript
    this.socketClient.on('other_player_move', (data) => {
      // 다른 플레이어 위치 업데이트 로직
    });
    ```

---

## 🎨 자산(Assets) 관리

게임에 사용되는 이미지, 사운드, 타일셋 등은 `src/renderer/public/assets/` 폴더에 배치하는 것을 권장합니다. 
- **로드 예시**: `this.load.image('player', 'assets/sprites/player.png');`

---

## ⚠️ 주의 사항
1.  **메모리 관리**: 씬 전환 시 `destroy()`나 이벤트를 적절히 해제하여 메모리 누수를 방지하세요.
2.  **프로세스 격리**: 게임 로직 내에서 Node.js 모듈(fs, net 등)을 직접 사용하지 마세요. 필요한 경우 반드시 IPC 브릿지를 통해 Main 프로세스에 요청해야 합니다.
