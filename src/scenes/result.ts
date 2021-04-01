import Phaser from 'phaser';

import { GameState } from '../state/game';
import { FONT_CONFIG } from './utils';

export class ResultScene extends Phaser.Scene {
  private state!: GameState;

  public constructor() {
    super('ResultScene');
  }

  public init(data: any) {
    this.state = data.state as GameState;
  }

  create() {
    this.scene.bringToTop();

    const { width, height } = this.game.config;
    const { score } = this.state;
    
    const texture = this.add.renderTexture(0, 0, Number(width), Number(height));
    texture.fill(0x000000, 0.7);
    texture.setAlpha(0);

    const titleText = this.add.text(Number(width) / 2, -100, 'Game Over!', {
      ...FONT_CONFIG,
      fontSize: '24px',
    });
    const scoreText = this.add.text(-100, Number(height) * 3.75 / 10, `Your Score: ${score}`, {
      ...FONT_CONFIG,
      fontSize: '14px',
    });

    const replayButton = this.add.image(Number(width) + 100, Number(height) / 2, 'restart');
    const backButton = this.add.image(Number(width) + 50, Number(height) / 2, 'back');

    replayButton.setScale(1.75);
    replayButton.setInteractive({ cursor: 'pointer' });
    backButton.setScale(1.75);
    backButton.setInteractive({ cursor: 'pointer' });

    titleText.setOrigin(0.5);
    scoreText.setOrigin(0.5);

    this.tweens.add({
      targets: texture,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.tweens.add({
          targets: titleText,
          y: Number(height) / 10 * 3,
          ease: 'Power2',
          duration: 1000,
          onComplete: () => {
            this.tweens.add({
              targets: scoreText,
              x: Number(width) / 2,
              ease: 'Power2',
              duration: 1500,
            });

            this.tweens.add({
              targets: replayButton,
              x: Number(width) / 2 + replayButton.displayWidth * 0.8,
              ease: 'Power2',
              duration: 1500,
            });

            this.tweens.add({
              targets: backButton,
              x: Number(width) / 2 - backButton.displayWidth * 0.8,
              ease: 'Power2',
              duration: 1500,
            });
          },
        });
      },
    });
  }
}
