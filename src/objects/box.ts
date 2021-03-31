import Phaser from 'phaser';

export class Box extends Phaser.Physics.Arcade.Image {
  private context: Phaser.Scene;

  private constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
  ) {
    super(scene, x, y, texture);

    this.context = scene;
  }

  public static createRandomBox(
    scene: Phaser.Scene,
    gravity: number = 300,
  ): Box {
    const id = Math.floor(Math.random() * 3) + 1;
    const texture = `box-${id}`;

    const { width } = scene.game.config;

    const box = new Box(
      scene,
      Math.random() * Number(width),
      0,
      texture,
    );

    box.setGravityY(gravity);

    return box;
  }

  public setCollider(
    obj: Phaser.GameObjects.GameObject,
    callback: ArcadePhysicsCallback,
  ): void {
    this.context.physics.add.overlap(this, obj, callback);
  }

  public breakBox(): void {

  }
}
