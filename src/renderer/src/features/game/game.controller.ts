import * as Phaser from 'phaser';
import { AimingBehaviorTree } from '../../../../features/ai/trees/aiming.tree';

/**
 * GameController
 * 역할: Phaser 게임 인스턴스 생명주기 및 로직 관리
 */
export class GameController {
  private game: Phaser.Game | null = null;

  public initGame(containerId: string): void {
    // 기존 인스턴스 정리
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      pixelArt: true, // 픽셀을 선명하게 렌더링 (안티앨리어싱 비활성화)
      roundPixels: true, // 좌표를 정수로 반올림하여 번짐 방지
      resolution: window.devicePixelRatio || 1, // 고해상도 디스플레이 대응
      scale: {
        mode: Phaser.Scale.NONE, // 고정 크기 사용 (지터링 방지)
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: containerId,
        width: 800,
        height: 600
      },
      scene: {
        preload: this.preload,
        create: this.create,
      },
    };

    this.game = new Phaser.Game(config);
  }

  private preload(): void {
    // 에셋이 없으므로 도형으로 대체
  }

  private create(this: Phaser.Scene): void {
    console.log('Phaser Game Initialized: Aiming AI');

    this.cameras.main.setBackgroundColor('#2c3e50');

    const projectile = this.add.circle(100, 500, 15, 0x3498db);
    const target = this.add.circle(600, 400, 15, 0xe74c3c);
    const infoText = this.add.text(10, 10, '', { fontSize: '18px', color: '#ffffff' });
    
    let speedMultiplier = 1.0;
    let autoMove = true;
    let autoRelocate = true;

    // 버튼 스타일 UI
    const createButton = (x: number, y: number, text: string, callback: (btn: any) => void) => {
        const btn = this.add.text(x, y, text, { fontSize: '18px', color: '#ecf0f1', backgroundColor: '#34495e', padding: { x: 10, y: 5 } })
            .setInteractive()
            .on('pointerdown', () => callback(btn));
        return btn;
    };

    const aiTree = new AimingBehaviorTree(projectile, target, infoText, autoMove, autoRelocate);

    createButton(10, 50, 'Move: ON', (btn) => {
        autoMove = !autoMove;
        aiTree.setAutoMove(autoMove);
        (btn as Phaser.GameObjects.Text).setText(`Move: ${autoMove ? 'ON' : 'OFF'}`);
    });

    createButton(120, 50, 'Relocate: ON', (btn) => {
        autoRelocate = !autoRelocate;
        aiTree.setAutoRelocate(autoRelocate);
        (btn as Phaser.GameObjects.Text).setText(`Relocate: ${autoRelocate ? 'ON' : 'OFF'}`);
    });

    // 배속 조절 UI
    const speedText = this.add.text(10, 90, 'Speed: 1.0x (Up/Down)', { fontSize: '18px', color: '#f1c40f' });

    // 배속 조절 키 입력
    this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') speedMultiplier = Math.min(speedMultiplier + 0.1, 5.0);
      if (event.key === 'ArrowDown') speedMultiplier = Math.max(speedMultiplier - 0.1, 0.1);
      speedText.setText(`Speed: ${speedMultiplier.toFixed(1)}x (Up/Down)`);
    });

    this.events.on('update', () => {
      aiTree.update(speedMultiplier);
    });
  }

  public destroy(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }
}
