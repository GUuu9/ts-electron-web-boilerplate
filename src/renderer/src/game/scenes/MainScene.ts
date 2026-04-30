import * as Phaser from 'phaser';
import { container } from '../../../../core/di/container.renderer.js';
import { SocketClient } from '../../../../core/network/socket.client.js';

/**
 * MainScene
 * 게임의 메인 로직이 진행되는 기본 씬입니다.
 * 인프라 서비스(SocketClient)를 주입받아 멀티플레이 기능을 구현할 수 있습니다.
 */
export class MainScene extends Phaser.Scene {
  private socketClient: SocketClient;
  private statusText!: Phaser.GameObjects.Text;
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super({ key: 'MainScene' });
    // DI 컨테이너에서 필요한 서비스를 가져옵니다.
    this.socketClient = container.get<SocketClient>('SocketClient');
  }

  preload() {
    // 배경 및 에셋 로드 (예시로 그라데이션 이미지 등을 생성하거나 로드할 수 있습니다)
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('red', 'assets/particles/red.png');
    this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    // 1. 배경 설정
    this.add.image(400, 300, 'sky');

    // 2. 파티클 효과 (인프라 연결 확인용)
    const particles = this.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    // 3. 플레이어 캐릭터 생성
    this.player = this.physics.add.sprite(400, 300, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    particles.startFollow(this.player);

    // 4. 애니메이션 정의
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'turn',
      frames: [ { key: 'dude', frame: 4 } ],
      frameRate: 20
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    // 5. 입력 제어
    this.cursors = this.input.keyboard!.createCursorKeys();

    // 입력 디버깅 (키가 눌릴 때마다 콘솔 출력)
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}`);
    });

    // 게임 시작 시 캔버스에 포커스 강제 (키보드 입력 활성화용)
    this.game.canvas.focus();
    this.input.on('pointerdown', () => {
      this.game.canvas.focus();
    });

    // 6. UI 및 인프라 상태 표시
    this.statusText = this.add.text(16, 16, 'System: Ready', { fontSize: '18px', color: '#fff' });
    
    // SocketClient 연결 테스트
    const socketStatus = this.socketClient.isConnected() ? 'Connected' : 'Disconnected';
    this.add.text(16, 40, `Socket: ${socketStatus}`, { fontSize: '14px', color: '#0f0' });

    console.log('MainScene created with SocketClient:', this.socketClient);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
  }
}
