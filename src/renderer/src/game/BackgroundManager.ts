import * as Phaser from 'phaser';

/**
 * BackgroundManager
 * 스프라이트 시트 이미지를 타일 단위로 잘라 배경을 구성합니다.
 */
export class BackgroundManager {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  /**
   * 배경 타일을 배치합니다.
   * @param textureKey 로드된 텍스처 키
   * @param tileWidth 타일 가로 크기
   * @param tileHeight 타일 세로 크기
   * @param cols 가로 타일 개수
   * @param rows 세로 타일 개수
   */
  public generate(textureKey: string, tileWidth: number, tileHeight: number, cols: number, rows: number) {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // 스프라이트 시트의 특정 프레임(x, y)을 사용하여 타일 배치
        this.scene.add.sprite(
          x * tileWidth + tileWidth / 2, 
          y * tileHeight + tileHeight / 2, 
          textureKey, 
          y * cols + x
        );
      }
    }
  }
}
