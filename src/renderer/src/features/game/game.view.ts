/**
 * GameView
 * 역할: Phaser 게임이 렌더링될 DOM 요소 관리
 */
export class GameView {
  public getHtml(subType: string): string {
    return `
      <div id="game-wrapper" style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
        <div id="game-container" style="width: 100%; height: 100%; background: #333;"></div>
      </div>
    `;
  }
}
