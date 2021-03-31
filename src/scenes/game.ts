import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private terrain!: Phaser.GameObjects.TileSprite;

  private boxes!: Phaser.GameObjects.Group;

  public constructor() {
    super('GameScene');
  }

  public create() {
    const { width, height } = this.game.config;

    this.background = this.add
      .tileSprite(0, 0, Number(width), Number(height), 'background')
      .setOrigin(0, 0);

    this.terrain = this.add
      .tileSprite(0, Number(height), Number(width), 16, 'terrain', 2)
      .setOrigin(0, 0.5);

    this.boxes = this.add.group();
  }
}
