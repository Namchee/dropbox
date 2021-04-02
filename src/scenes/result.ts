import Phaser from 'phaser';

import { GameState } from '../state/game';
import { GameScene } from './game';
import { FONT_CONFIG } from './utils';

export class ResultScene extends Phaser.Scene {
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

    const replayButton = this.add.image(Number(width) / 2 + 32, Number(height) + 100, 'restart');
    const backButton = this.add.image(Number(width) / 2 - 32, Number(height) + 100, 'back');
    let recordText: Phaser.GameObjects.Text;

    replayButton.setScale(1.75);
    replayButton.setInteractive({ cursor: 'pointer' });
    backButton.setScale(1.75);
    backButton.setInteractive({ cursor: 'pointer' });

    titleText.setOrigin(0.5);
    scoreText.setOrigin(0.5);

    if (this.isRecord) {
      recordText = this.add.text(Number(width) + 100, Number(height) * 0.425, 'New Record!', {
        ...FONT_CONFIG,
        fontSize: '10px',
      });
      recordText.setOrigin(0.5);
    }

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

            if (recordText) {
              this.tweens.add({
                targets: recordText,
                x: Number(width) * 0.525,
                ease: 'Power2',
                duration: 1500,
              });
            }

            this.tweens.add({
              targets: replayButton,
              y: Number(height) * 0.525,
              ease: 'Power2',
              duration: 1500,
              onComplete: () => {
                replayButton.setInteractive({ cursor: 'pointer' });
                replayButton.on('pointerup', () => {
                  const gameScene = this.scene.get('GameScene') as GameScene;

                  this.scene.setActive(false);
                  this.scene.setVisible(false);
                  this.scene.sendToBack();
                  this.input.disable(backButton);
                  this.input.disable(replayButton);

                  gameScene.restart();
                });
              },
            });

            this.tweens.add({
              targets: backButton,
              y: Number(height) * 0.525,
              ease: 'Power2',
              duration: 1500,
              onComplete: () => {
                backButton.setInteractive({ cursor: 'pointer' });
                backButton.on('pointerup', () =>{
                  this.scene.start('HomeScene');
                });
              },
            });
          },
        });
      },
    });
  }

  private restart() {
    this.scene
  }
}
