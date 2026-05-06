import * as Phaser from 'phaser';
import { MainScene } from './scenes/MainScene.js';

/**
 * PhaserGame
 * Phaser 엔진의 인스턴스를 생성하고 관리하는 래퍼 클래스입니다.
 */
export class PhaserGame {
  private game: Phaser.Game;

  constructor(containerId: string) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: containerId,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300, x: 0 },
          debug: true
        }
      },
      scene: [MainScene]
    };

    this.game = new Phaser.Game(config);
  }

  public getGameInstance(): Phaser.Game {
    return this.game;
  }
}
