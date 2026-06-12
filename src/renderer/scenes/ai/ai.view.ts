import { AIViewModel } from './ai.viewmodel.js';
import * as Phaser from 'phaser';

/**
 * AI View
 */
export class AIView {
  private game: Phaser.Game | null = null;
  private statusText: Phaser.GameObjects.Text | null = null;

  public render(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="view-container ai-view">
        <header class="view-header">
          <h3 class="view-title"><i data-lucide="brain"></i> Behavior Tree AI (Physics)</h3>
        </header>
        <section class="view-content" style="display: flex; justify-content: center; align-items: center; background: #000; padding: 0; overflow: hidden;">
          <div id="ai-phaser-container" style="width: 800px; height: 600px;"></div>
        </section>
      </div>
    `;
    (window as any).lucide?.createIcons();
  }

  public destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  public get elements() {
    return {
      get phaserContainer() { return document.getElementById('ai-phaser-container'); }
    };
  }

  public initPhaser(viewModel: AIViewModel) {
    if (this.game) return;

    const container = this.elements.phaserContainer;
    if (!container) return;

    viewModel.setActive(true);

    const self = this;
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: container,
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 300 } }
      },
      scene: {
        create: function(this: Phaser.Scene) {
          self.statusText = this.add.text(10, 10, '', { color: '#ffffff', fontSize: '16px' });
          (this as any).angleText = this.add.text(10, 30, '', { color: '#ffff00', fontSize: '16px' });
          (this as any).powerText = this.add.text(10, 50, '', { color: '#00ffff', fontSize: '16px' });
          
          // 조준선
          (this as any).aimLine = this.add.line(0, 0, 0, 0, 0, 0, 0xffff00);
          (this as any).aimLine.setVisible(false);
          
          // 타겟
          const targetGraphics = this.add.circle(0, 0, 15, 0xff0000);
          (this as any).targetObj = this.physics.add.existing(targetGraphics, true); 
          (this as any).targetObj.setVisible(false);
          
          // 투사체
          const projGraphics = this.add.circle(100, 500, 8, 0x0000ff);
          (this as any).projObj = this.physics.add.existing(projGraphics, false);
          (this as any).projObj.body.setBounce(0.8, 0.8);
          (this as any).projObj.body.setCollideWorldBounds(true);
          (this as any).projObj.setVisible(false);

          // 충돌
          this.physics.add.collider((this as any).projObj, (this as any).targetObj, () => {
            console.log('명중!');
            viewModel.hitTarget();
            viewModel.respawnTarget();
            (this as any).projObj.setVisible(false);
            (this as any).projObj.body.setEnable(false);
            (this as any).projObj.body.setVelocity(0, 0);
          });
        },
        update: function(this: Phaser.Scene) {
          try {
            const data = viewModel.getRenderData();
            if (!data.isViewActive) return;

            self.statusText?.setText(`Status: ${data.status}`);
            (this as any).angleText.setText(`Angle: ${((data.aimAngle || 0) * 180 / Math.PI).toFixed(1)}°`);
            (this as any).powerText.setText(`Power: ${(data.aimForce || 0).toFixed(0)}`);
            
            // 타겟 설정
            if (data.targetPos && (this as any).targetObj) {
              (this as any).targetObj.setPosition(data.targetPos.x, data.targetPos.y);
              (this as any).targetObj.setVisible(true);
            }
            
            // 발사 시작
            if (data.isThrowing && (this as any).projObj && !(this as any).projObj.visible) {
              const angle = data.aimAngle || 0;
              const endX = 100 + Math.cos(angle) * 100;
              const endY = 500 + Math.sin(angle) * 100;
              (this as any).aimLine.setTo(100, 500, endX, endY);
              (this as any).aimLine.setVisible(true);
              
              this.time.delayedCall(500, () => {
                  if (!(this as any).projObj) return;
                  (this as any).aimLine.setVisible(false);
                  (this as any).projObj.setVisible(true);
                  (this as any).projObj.body.setEnable(true);
                  (this as any).projObj.setPosition(100, 500);
                  (this as any).projObj.body.setAllowGravity(true);
                  
                  this.physics.velocityFromRotation(angle, data.aimForce || 400, (this as any).projObj.body.velocity);
              });
            }

            // 바닥 충돌
            if ((this as any).projObj && (this as any).projObj.visible && (this as any).projObj.body.blocked.down) {
              (this as any).projObj.setVisible(false);
              (this as any).projObj.body.setEnable(false);
              (this as any).projObj.body.setVelocity(0, 0);
              viewModel.resetThrowing();
            }
          } catch (e) {
            console.error('[AI Phaser Update Error]', e);
          }
        }
      }
    };
    this.game = new Phaser.Game(config);
  }
}

/**
 * AI Binder
 */
export class AIBinder {
  constructor(
    private readonly view: AIView,
    private readonly viewModel: AIViewModel
  ) {}

  public bind() {
    console.log('[AI] Binder initialized.');
  }

  public init() {
    this.view.initPhaser(this.viewModel);
  }
}
