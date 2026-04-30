# 🎮 Phaser.js 게임 개발 가이드

이 문서는 프로젝트의 Phaser.js 엔진 구조와 인프라 서비스(DI) 연동 방법을 설명합니다.

---

## 🏗 핵심 아키텍처

이 보일러플레이트는 Phaser의 **Scene** 시스템과 프로젝트의 **Dependency Injection(DI)** 컨테이너를 통합하여 관리합니다.

### 1. Phaser 인스턴스 관리 (`PhaserGame.ts`)
Phaser 엔진의 초기화 및 전역 설정(물리 엔진, 화면 크기 등)을 담당합니다.
- **경로**: `src/renderer/src/game/PhaserGame.ts`
- **역할**: 게임 설정 객체(GameConfig)를 정의하고 `new Phaser.Game(config)`을 통해 엔진을 기동합니다.

### 2. 씬(Scene) 개발 규약 및 라이프사이클
모든 게임 씬은 `src/renderer/src/game/scenes/` 하위에 작성하며, Phaser의 핵심 라이프사이클 함수를 이해하고 사용해야 합니다.

| 함수명 | 실행 시점 | 주요 역할 |
| :--- | :--- | :--- |
| **init()** | 가장 먼저 실행 | 씬 시작 시 필요한 데이터 전달 및 초기 변수 설정 |
| **preload()** | 에셋 로딩 단계 | 이미지, 사운드, JSON 등 외부 파일 로드 (`this.load.xxx`) |
| **create()** | 로딩 완료 후 실행 | 게임 객체 생성, 물리 엔진 설정, 애니메이션 정의 |
| **update()** | 매 프레임 실행 | 키보드 입력 체크, 충돌 처리, 게임 로직 업데이트 (초당 약 60회) |

```typescript
export class MyScene extends Phaser.Scene {
  constructor() { super({ key: 'MyScene' }); }

  init(data: any) { console.log('Data from previous scene:', data); }
  
  preload() { this.load.image('logo', 'assets/logo.png'); }

  create() {
    this.add.image(400, 300, 'logo');
    // DI 컨테이너 서비스 활용
    const persistence = container.get<any>('PersistenceService');
  }

  update(time: number, delta: number) { /* 매 프레임 로직 */ }
}
```

---

## 🚀 게임 개발 핵심 기능 (Essentials)

### 1. 게임 객체 생성 및 물리 (Physics)
Phaser는 `Arcade Physics` 엔진을 기본으로 사용합니다.
- **이미지 배치**: `this.add.image(x, y, key)` (물리 영향 없음, 배경 등)
- **스프라이트 생성**: `this.physics.add.sprite(x, y, key)` (중력, 충돌 등 물리 법칙 적용)
- **충돌 설정**: 
  ```typescript
  this.physics.add.collider(player, platforms); // 두 객체 간 충돌(뚫고 지나가지 못함)
  this.physics.add.overlap(player, items, collectItem, null, this); // 겹침 감지 (아이템 먹기 등)
  ```

### 2. 입력 처리 (Input)
- **키보드 커서**: `this.cursors = this.input.keyboard.createCursorKeys();`
- **특정 키 바인딩**: `this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);`
- **마우스/터치**: `this.input.on('pointerdown', (pointer) => { ... });`

### 3. 씬 관리 (Scene Management)
- **씬 전환**: `this.scene.start('NextScene', { score: 100 });` (현재 씬 종료 후 이동)
- **씬 중첩**: `this.scene.launch('UIScene');` (현재 씬을 둔 채 위에 UI 등을 덮어씌움)

### 4. 카메라 제어 (Camera)
- **객체 따라가기**: `this.cameras.main.startFollow(player);`
- **화면 흔들기**: `this.cameras.main.shake(200, 0.05);`
- **서서히 나타나기**: `this.cameras.main.fadeIn(1000);`

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
