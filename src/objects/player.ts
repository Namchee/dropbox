import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private isLeftDown!: boolean;
  private isRightDown!: boolean;
  private isPointerDown!: boolean;

  private _isDead!: boolean;

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
    player.anims.play('chara-idle');

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

  public update() {
    if (this.isPointerDown) {
      const { x: pointerX } = this.scene.input.activePointer;
      const { x: bodyX } = this.body.position;
      const centerPoint = this.displayWidth / 2;

      const bodyPosition = bodyX + centerPoint;

      if (Math.abs(pointerX - bodyPosition) < 4) {
        this.idle();
        
        if (this.anims.getName() !== 'chara-idle') {
          this.anims.play('chara-idle');
        }
      } else if (Number(pointerX) > bodyPosition) {
        this.walk(1);

        if (this.anims.getName() !== 'chara-run') {
          this.anims.play('chara-run');
        }
      } else if (Number(pointerX) < bodyPosition) {
        this.walk(-1);

        if (this.anims.getName() !== 'chara-run') {
          this.anims.play('chara-run');
        }
      }
    } else {
      if (this.isLeftDown) {
        this.walk(-1);
      } else if (this.isRightDown) {
        this.walk(1);
      } else {
        this.idle();
      }
    }
  }

  public listenInputs() {
    const leftArrow = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );

    const rightArrow = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );

    this.scene.input.on('pointerdown', () => {
      this.isPointerDown = true;
      this.anims.play('chara-run');
    });
    
    this.scene.input.on('pointerup', () => {
      this.isPointerDown = false;

      if (!this.isLeftDown && !this.isRightDown) {
        this.anims.play('chara-idle');
      }
    });

    leftArrow.on('down', () => {
      this.isLeftDown = true;
      this.anims.play('chara-run');
    });

    leftArrow.on('up', () => {
      this.isLeftDown = false;

      if (!this.isPointerDown && !this.isRightDown) {
        this.anims.play('chara-idle');
      }
    })

    rightArrow.on('down', () => {
      this.isRightDown = true;
      this.anims.play('chara-run');
    });

    rightArrow.on('up', () => {
      this.isRightDown = false;

      if (!this.isPointerDown && !this.isLeftDown) {
        this.anims.play('chara-idle');
      }
    });
  }

  public disableInputs() {
    this.isLeftDown = false;
    this.isRightDown = false;
    this.isPointerDown = false;

    this.scene.input.keyboard.removeKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );

    this.scene.input.keyboard.removeKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );

    this.scene.input.removeAllListeners('pointerup');
    this.scene.input.removeAllListeners('pointerdown');
  }

  private walk(direction: -1 | 1) {
    if (this.body.enable) {
      if (direction === -1) {
        this.setVelocityX(-150);
        this.setFlipX(true);
      } else {
        this.setVelocityX(150);
        this.setFlipX(false);
      }
    }
  }

  private idle() {
    if (this.body.enable) {
      this.setVelocityX(0);
    }
  }

  public revive() {
    this.body.enable = true;
    this.setVisible(true);

    this.anims.play('chara-idle');
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
