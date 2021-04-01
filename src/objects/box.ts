import Phaser from 'phaser';

export class Box extends Phaser.Physics.Arcade.Image {
  private static readonly SCALING = {
    1: 1,
    2: 1.33,
    3: 1.67,
  };

  private readonly debrisManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  private readonly smokeManager: Phaser.GameObjects.Particles.ParticleEmitterManager;

  private constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    id: 1 | 2 | 3,
  ) {
    super(scene, x, y, `box-${id}`);

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this.debrisManager = scene.add.particles(`box-${id}-break`);
    // debris
    const debris = this.debrisManager.createEmitter({
      frame: [0, 1, 2, 3],
      quantity: 8,
      gravityY: 200,
      lifespan: 2500,
      maxParticles: 12,
      alpha: { start: 1.0, end: 0.0 },
      scale: { start: Box.SCALING[id] * 0.75, end: Box.SCALING[id] * 0.75 },
      on: false,
    });

    debris.setBounds(
      x,
      Number(this.scene.game.config.height) - this.displayHeight,
      16,
      this.displayHeight - 8,
    );

    // smoke
    this.smokeManager = scene.add.particles('smoke');

    this.smokeManager.createEmitter({
      on: false,
      maxParticles: 1,
      scale:{ start: Box.SCALING[id] * 4, end: Box.SCALING[id] * 4 },
      alpha: { start: 1.0, end: 0.0 },
      quantity: 1,
      lifespan: 2250,
    });
  }

  public static createRandomBox(
    scene: Phaser.Scene,
    gravity: number = 200,
  ): Box {
    const id = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;

    const { width } = scene.game.config;

    const box = new Box(
      scene,
      Math.random() * Number(width),
      0,
      id,
    );
    box.setOrigin(0.5, 0.5);

    box.setCollideWorldBounds(true);
    // @ts-ignore
    box.body.onWorldBounds = true;
    box.handleWorldCollision();

    box.setScale(Box.SCALING[id], Box.SCALING[id]);
    box.setGravityY(gravity);

    return box;
  }

  public setCollider(
    obj: Phaser.GameObjects.GameObject,
    callback: ArcadePhysicsCallback,
  ): void {
    this.scene.physics.add.overlap(this, obj, callback);
  }

  private handleWorldCollision(): void {
    const { height } = this.scene.game.config;
  
    this.body.world.on('worldbounds', () => {
      const { x, y } = this.body.position;

      if (Number(height) - (y + this.displayHeight) === 8) {
        this.debrisManager.emitParticleAt(
          x + this.displayWidth / 2, y + this.displayHeight * 0.8);
        this.smokeManager.emitParticleAt(
          x + this.displayWidth / 2, y + this.displayHeight / 3);
        
        this.setAlpha(0);
        this.setActive(false);
      }
    });
  }
}
