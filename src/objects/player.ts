import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isLeftDown!: boolean;
  private isRightDown!: boolean;

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

    player.handleInput();

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

  private handleInput() {
    const leftArrow = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );

    const rightArrow = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );

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
