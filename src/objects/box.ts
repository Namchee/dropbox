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
      gravityY: 250,
      lifespan: { min: 2000, max: 2250 },
      bounce: { min: 0, max: 0.35 },
      maxParticles: 8,
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
      lifespan: 2000,
    });
  }

  public static createRandomBox(
    scene: Phaser.Scene,
    gravity: number = 300,
  ): Box {
    const id = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;

    const { width } = scene.game.config;

    const box = new Box(
      scene,
      Math.random() * Number(width),
      -16 * Box.SCALING[id],
      id,
    );
    box.setOrigin(0.5, 0.5);

    box.setCollideWorldBounds(true);
    // @ts-ignore
    box.body.onWorldBounds = true;
    box.handleWorldCollision();

    box.setScale(Box.SCALING[id], Box.SCALING[id]);
    box.setGravityY(gravity * Box.SCALING[id]);

    return box;
  }

  private handleWorldCollision(): void {
    const { height } = this.scene.game.config;
  
    this.body.world.on('worldbounds', () => {
      if (!this.active) {
        return;
      }

      const { x, y } = this.body.position;

      if (Number(height) - (y + this.displayHeight) === 8) {
        this.debrisManager.emitParticleAt(
          x + this.displayWidth / 2, y + this.displayHeight * 0.85);
        this.smokeManager.emitParticleAt(
          x + this.displayWidth / 2, y + this.displayHeight / 3);
        
        this.setVisible(false);
        this.setActive(false);
      }
    });
  }
}
