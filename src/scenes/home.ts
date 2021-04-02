import Phaser from 'phaser';

import { preload } from './../utils/preloader';
import { GameScene } from './game';
import { FONT_CONFIG } from './utils';

export class HomeScene extends Phaser.Scene {
  public constructor() {
    super('HomeScene');
  }

  public preload() {
    preload(this);
  }

  create() {
    this.scene.bringToTop();

    const { width, height } = this.game.config;

    const texture = this.add.renderTexture(0, 0, Number(width), Number(height));
    texture.fill(0x000000, 0.6);

    const titleText = this.add.text(Number(width) / 2, Number(height) * 0.4, 'DROP.BOX', {
      ...FONT_CONFIG,
      fontSize: '32px',
    });
    titleText.setOrigin(0.5, 0.5);
    titleText.setAlpha(0);

    const startButton = this.add.image(Number(width) / 2, Number(height) * 0.525, 'play');
    startButton.setOrigin(0.5, 0.5);
    startButton.setScale(2.25);
    startButton.setAlpha(0);

    this.tweens.add({
      targets: [startButton, titleText],
      alpha: 1,
      ease: 'Sine.easeOut',
      duration: 500,
      onComplete: () => {
        startButton.setInteractive({ cursor: 'pointer' });
        startButton.on('pointerup', () => {
          this.tweens.add({
            targets: [texture, startButton, titleText],
            alpha: 0,
            duration: 250,
            onComplete: () => {
              this.sound.play('button');

              this.scene.sendToBack();
              (this.scene.get('GameScene') as GameScene).startGame();
            },
          });
        });
      },
    });

    this.scene.launch('GameScene');
  }
}
