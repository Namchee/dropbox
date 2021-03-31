import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,

  ) {
    super(scene, x, y, 'player');
  }

  public static create(scene: Phaser.Scene) {
    const { width } = scene.game.config;

    const player = new Player(scene, Number(width) / 2, 20);
    player.setOrigin(Number(width) / 2, 20);

    return player;
  }

  public animate() {

  }
}
