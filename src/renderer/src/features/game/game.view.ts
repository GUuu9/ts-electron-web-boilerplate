/**
 * GameView
 * 역할: Phaser 게임이 렌더링될 DOM 요소 관리
 */
export class GameView {
  public getHtml(subType: string): string {
    return `
      <div id="game-wrapper" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden; background: #1a1a1a; border-radius: 1rem;">
        <div id="game-container" style="width: 800px; height: 600px; box-shadow: 0 0 20px rgba(0,0,0,0.5);"></div>
      </div>
    `;
  }
}
