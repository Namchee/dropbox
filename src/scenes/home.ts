import Phaser from 'phaser';

import { GameScene } from './game';
import { FONT_CONFIG } from './utils';

export class HomeScene extends Phaser.Scene {
  private bgTexture!: Phaser.GameObjects.RenderTexture;

  private playButton!: Phaser.GameObjects.Image;
  private sfxButton!: Phaser.GameObjects.Image;

  private titleText!: Phaser.GameObjects.Text;

  private sfx!: boolean;

  public constructor() {
    super('HomeScene');
  }

  create() {
    this.scene.bringToTop();

    this.sfx = true;
    const { width, height } = this.game.config;

    this.bgTexture = this.add.renderTexture(0, 0, Number(width), Number(height));
    this.bgTexture.fill(0x000000, 0.6);

    this.titleText = this.add.text(Number(width) / 2, Number(height) * 0.4, 'DROP.BOX', {
      ...FONT_CONFIG,
      fontSize: '32px',
    });
    this.titleText.setOrigin(0.5, 0.5);
    this.titleText.setAlpha(0);

    this.playButton = this.add.image(Number(width) / 2, Number(height) * 0.525, 'play');
    this.playButton.setOrigin(0.5, 0.5);
    this.playButton.setScale(2.25);
    this.playButton.setAlpha(0);

    this.sfxButton = this.add.image(Number(width) - 24, Number(height) - 24, 'volume-on');
    this.sfxButton.setScale(1.25);
    this.sfxButton.setAlpha(0);

    if (this.sound.volume === 0) {
      this.sfxButton.setTexture('volume-off');
      this.sfx = false;
    }

    this.tweens.add({
      targets: [this.playButton, this.sfxButton, this.titleText],
      alpha: 1,
      ease: 'Sine.easeOut',
      duration: 500,
      onComplete: () => {
        this.initMenu();
      },
    });

    this.scene.launch('GameScene');
  }

  private initMenu() {
    this.playButton.setInteractive({ cursor: 'pointer' });
    this.sfxButton.setInteractive({ cursor: 'pointer' });

    this.sfxButton.on('pointerup', () => {
      this.toggleSfx();
    });

    this.playButton.on('pointerdown', () => {
      this.playButton.setTexture('play-pressed');
    });

    this.playButton.on('pointerup', () => {
      this.sound.play('button');
      this.playButton.setTexture('play');
      this.playButton.removeInteractive();

      this.tweens.add({
        targets: [this.bgTexture, this.playButton, this.sfxButton, this.titleText],
        alpha: 0,
        duration: 350,
        onComplete: () => {
          this.scene.sendToBack();
          (this.scene.get('GameScene') as GameScene).startGame();
        },
      });
    });
  }

  private toggleSfx() {
    this.sound.play('button');
    this.sfx = !this.sfx;

    if (this.sfx) {
      this.sfxButton.setTexture('volume-on');
      this.sound.volume = 1;
    } else {
      this.sfxButton.setTexture('volume-off');
      this.sound.volume = 0;
    }
  }
}
