import Phaser from 'phaser';

import { GameState } from '../state/game';
import { GameScene } from './game';
import { FONT_CONFIG } from './utils';

export class ResultScene extends Phaser.Scene {
  private bgTexture!: Phaser.GameObjects.RenderTexture;

  private titleText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;

  private replayButton!: Phaser.GameObjects.Image;
  private homeButton!: Phaser.GameObjects.Image;

  private state!: GameState;
  private isRecord!: boolean;

  public constructor() {
    super('ResultScene');
  }

  public init(data: any) {
    this.state = data.state as GameState;
    this.isRecord = data.isRecord as boolean;
  }

  create() {
    this.scene.bringToTop();

    const { width, height } = this.game.config;
    const { score } = this.state;
    
    this.bgTexture = this.add.renderTexture(0, 0, Number(width), Number(height));
    this.bgTexture.fill(0x000000, 0.7);
    this.bgTexture.setAlpha(0);

    this.titleText = this.add.text(Number(width) / 2, -100, 'Game Over!', {
      ...FONT_CONFIG,
      fontSize: '24px',
    });
    this.scoreText = this.add.text(-100, Number(height) * 3.75 / 10, `Your Score: ${score}`, {
      ...FONT_CONFIG,
      fontSize: '14px',
    });

    this.replayButton = this.add.image(Number(width) / 2 + 32, Number(height) + 100, 'restart');
    this.homeButton = this.add.image(Number(width) / 2 - 32, Number(height) + 100, 'home');
    let recordText: Phaser.GameObjects.Text;

    this.replayButton.setScale(1.75);
    this.replayButton.setInteractive({ cursor: 'pointer' });
    this.homeButton.setScale(1.75);
    this.homeButton.setInteractive({ cursor: 'pointer' });

    this.titleText.setOrigin(0.5);
    this.scoreText.setOrigin(0.5);

    if (this.isRecord) {
      recordText = this.add.text(Number(width) + 100, Number(height) * 0.425, 'New Record!', {
        ...FONT_CONFIG,
        fontSize: '10px',
      });
      recordText.setOrigin(0.5);
    }

    this.tweens.add({
      targets: this.bgTexture,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.tweens.add({
          targets: this.titleText,
          y: Number(height) / 10 * 3,
          ease: 'Power2',
          duration: 1000,
          onComplete: () => {
            this.tweens.add({
              targets: this.scoreText,
              x: Number(width) / 2,
              ease: 'Power2',
              duration: 1500,
            });

            if (recordText) {
              this.tweens.add({
                targets: recordText,
                x: Number(width) * 0.525,
                ease: 'Power2',
                duration: 1500,
              });
            }

            this.tweens.add({
              targets: this.replayButton,
              y: Number(height) * 0.525,
              ease: 'Power2',
              duration: 1500,
              onComplete: () => {
                this.restartGame();
              },
            });

            this.tweens.add({
              targets: this.homeButton,
              y: Number(height) * 0.525,
              ease: 'Power2',
              duration: 1500,
              onComplete: () => {
                this.backToHome();
              },
            });
          },
        });
      },
    });
  }

  private restartGame() {
    this.replayButton.setInteractive({ cursor: 'pointer' });

    this.replayButton.on('pointerdown', () => {
      this.replayButton.setTexture('restart-pressed');
    });
  
    this.replayButton.on('pointerup', () => {
      this.sound.play('button');
      this.replayButton.setTexture('restart');
      const gameScene = this.scene.get('GameScene') as GameScene;

      this.scene.setActive(false);
      this.scene.setVisible(false);
      this.scene.sendToBack();
      this.input.disable(this.homeButton);
      this.input.disable(this.replayButton);

      gameScene.restart();
    });
  }

  private backToHome() {
    this.homeButton.setInteractive({ cursor: 'pointer' });

    this.homeButton.on('pointerdown', () => {
      this.homeButton.setTexture('home-pressed');
    });

    this.homeButton.on('pointerup', () => {
      this.sound.play('button');
      this.homeButton.setTexture('home');
      this.scene.start('HomeScene');
    });
  }
}
