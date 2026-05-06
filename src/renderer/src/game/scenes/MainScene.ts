import * as Phaser from 'phaser';
import { container } from '../../../../core/di/container.renderer.js';
import { SocketClient } from '../../../../core/network/socket.client.js';
import { NpcAgent } from '../NpcAgent.js';

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
  private npc!: NpcAgent;
  
  // 키 상태 직접 관리 (이벤트 기반)
  private keyState: { [key: string]: boolean } = {};

  constructor() {
    super({ key: 'MainScene' });
    // DI 컨테이너에서 필요한 서비스를 가져옵니다.
    this.socketClient = container.get<SocketClient>('SocketClient');
  }

  preload() {
    // 배경 및 에셋 로드
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('sky', 'assets/skies/space3.png');
    this.load.image('red', 'assets/particles/red.png');
    this.load.spritesheet('dude', 'assets/sprites/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    // ... (기존 create 로직)
    this.add.image(400, 300, 'sky');

    const particles = this.add.particles(0, 0, 'red', {
      speed: 100,
      scale: { start: 1, end: 0 },
      blendMode: 'ADD'
    });

    this.player = this.physics.add.sprite(400, 300, 'dude');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setGravityY(300);
    particles.startFollow(this.player);

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

    this.npc = new NpcAgent(this, 100, 100, 'dude', this.player);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      this.keyState[event.code] = true;
      console.log(`[Input] KeyDown: ${event.code}`);
    });

    this.input.keyboard!.on('keyup', (event: KeyboardEvent) => {
      this.keyState[event.code] = false;
    });

    // 명시적으로 업데이트 이벤트를 등록해봅니다 (Phaser 4 대비)
    this.events.on('update', () => {
      this.handleUpdate();
    });

    const focusCanvas = () => {
      this.game.canvas.focus();
    };
    focusCanvas();
    this.input.on('pointerdown', focusCanvas);

    this.statusText = this.add.text(16, 16, 'System: AI Active', { fontSize: '18px', color: '#fff' });
    
    console.log('MainScene Create Finished');
  }

  // update() 대신 handleUpdate()로 로직 분리
  handleUpdate() {
    if (!this.player) return;

    const leftDown = this.keyState['ArrowLeft'] || this.keyState['KeyA'];
    const rightDown = this.keyState['ArrowRight'] || this.keyState['KeyD'];
    const upDown = this.keyState['ArrowUp'] || this.keyState['KeyW'] || this.keyState['Space'];

    if (leftDown) {
      console.log('Update Loop Working: Left');
      this.player.setVelocityX(-200);
      this.player.anims.play('left', true);
    } else if (rightDown) {
      console.log('Update Loop Working: Right');
      this.player.setVelocityX(200);
      this.player.anims.play('right', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
    }

    if (upDown && (this.player.body as Phaser.Physics.Arcade.Body).blocked.down) {
      this.player.setVelocityY(-400);
    }

    if (this.npc) this.npc.update();
  }

  update() {
    // Phaser 3 표준 update 루프 (Phaser 4에서는 호출되지 않을 수 있음)
    this.handleUpdate();
  }
}
