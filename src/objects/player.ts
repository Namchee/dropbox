import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isLeftDown!: boolean;
  private isRightDown!: boolean;
  private isMouseDown!: boolean;

  public _isDead!: boolean;

  public constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
  ) {
    super(scene, x, y, 'player');

    scene.physics.world.enable(this);
    scene.add.existing(this);
  }

  public get isDead() {
    return this._isDead;
  }

  public static create(scene: Phaser.Scene): Player {
    const { width, height } = scene.game.config;

    const player = new Player(scene, Number(width) / 2, Number(height) - 8);
    player.setCollideWorldBounds(true);

    player.initAnimations();
    player.idle();

    return player;
  }

  private initAnimations() {
    this.anims.create({
      key: 'chara-idle',
      frames: this.anims.generateFrameNumbers('player', {}),
      frameRate: 24,
      repeat: -1,
    });

    this.anims.create({
      key: 'chara-run',
      frames: this.anims.generateFrameNumbers('player-run', {}),
      frameRate: 24,
      repeat: -1,
    });

    this.anims.create({
      key: 'chara-dead',
      frames: this.anims.generateFrameNumbers('player-die', {}),
      frameRate: 24,
      hideOnComplete: true,
      repeat: 3,
    });
  }

  public listenInputs() {
    const leftArrow = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );

    const rightArrow = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );

    this.scene.input.on('pointerdown', (pointer: PointerEvent) => {
      this.isMouseDown = true;

      const { x } = pointer;
      const isMovingLeft = x < Number(this.scene.game.config.width) / 2;

      if (isMovingLeft) {
        this.walk(-150, true);
      } else {
        this.walk(150, false);
      }
    });

    this.scene.input.on('pointermove', (event: PointerEvent) => {
      if (!this.isMouseDown) {
        return;
      }

      const { x } = event;
      const isMovingLeft = x < Number(this.scene.game.config.width) / 2;

      if (isMovingLeft && this.body.velocity.x == 150) {
        this.walk(-150, true);
      } else if (this.flipX && this.body.velocity.x == -150) {
        this.walk(150, false);
      }
    });

    this.scene.input.on('pointerup', () => {
      this.isMouseDown = false;

      if (this.isRightDown) {
        this.walk(150, false);
      } else if (this.isLeftDown) {
        this.walk(-150, true);
      } else {
        this.idle();
      }
    });

    leftArrow.on('down', () => {
      this.isLeftDown = true;
      this.walk(-150, true);
    });

    leftArrow.on('up', () => {
      this.isLeftDown = false;

      if (this.isRightDown) {
        this.walk(150, false);
      } else {
        this.idle();
      }
    })

    rightArrow.on('down', () => {
      this.isRightDown = true;
      this.walk(150, false);
    });

    rightArrow.on('up', () => {
      this.isRightDown = false;
  
      if (this.isLeftDown) {
        this.walk(-150, true);
      } else {
        this.idle();
      }
    });
  }

  public disableInputs() {
    this.isLeftDown = false;
    this.isRightDown = false;

    this.scene.input.keyboard.removeKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );

    this.scene.input.keyboard.removeKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );

    this.scene.input.removeListener('pointerup');
    this.scene.input.removeListener('pointermove');
    this.scene.input.removeListener('pointerdown');
  }

  private walk(speed: number, direction: boolean) {
    if (this.body.enable) {
      this.setVelocityX(speed);
      this.setFlipX(direction);

      this.anims.play('chara-run');
    }
  }

  private idle() {
    if (this.body.enable) {
      this.setVelocityX(0);
    
      this.anims.play('chara-idle');
    }
  }

  public revive() {
    this.body.enable = true;
    this.setVisible(true);
    this._isDead = false;

    const { width, height } = this.scene.game.config;

    this.setPosition(Number(width) / 2, Number(height) - 8);
    this.setFlipX(false);

    this.idle();
  }

  public die() {
    this.body.enable = false;
    this._isDead = true;

    this.anims.stop();
    this.anims.play('chara-dead');
  }

  public setDieCallback(callback: Function) {
    this.on('animationcomplete', callback);
  }
}
