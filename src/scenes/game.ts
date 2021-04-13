import Phaser from 'phaser';

import { Player } from './../objects/player';
import { Box } from './../objects/box';

import { GameState } from '../state/game';

import { FONT_CONFIG } from './utils';
import { GameStorage } from '../state/storage';

export class GameScene extends Phaser.Scene {
  private static readonly spawnTime: Record<string, number> = {
    0: 750,
    25: 500,
    50: 250,
    100: 100,
  };

  private player!: Player;
  private boxes!: Phaser.GameObjects.Group;

  private scoreText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;

  private bgTexture!: Phaser.GameObjects.TileSprite;

  private state!: GameState;

  private difficulty!: number;

  private spawnTime!: number;

  public constructor() {
    super('GameScene');
  }

  public create() {
    const { width, height } = this.game.config;
  
    this.state = this.initState();

    this.bgTexture = this.add.tileSprite(0, 0, Number(width), Number(height), 'background')
      .setOrigin(0, 0);

    this.add.tileSprite(0, Number(height), Number(width), 16, 'terrain', 2)
      .setOrigin(0, 0.5);
    this.physics.world.setBounds(0, 0, Number(width), Number(height) - 8);

    this.boxes = this.add.group();

    this.player = Player.create(this);
    this.player.setDepth(1);
    this.player.setDieCallback(() => {
      this.sound.play('die');
      this.showResultScene();
    });

    const highScore = GameStorage.getInstance().highScore;

    this.scoreText = this.add.text(
      16,
      16,
      `SCORE: ${this.state.score.toString().padStart(5, '0')}`,
      {
        ...FONT_CONFIG,
        fontSize: '12px',
      },
    );
    this.highScoreText = this.add.text(
      Number(width) - 16,
      16,
      `HI: ${highScore.toString().padStart(5, '0')}`,
      {
        ...FONT_CONFIG,
        fontSize: '12px',
      },
    );

    this.highScoreText.setOrigin(1, 0);

    this.spawnTime = 0;
  }

  public startGame() {
    const { width, height } = this.game.config;

    this.difficulty = 0;

    let num = 3;
  
    const indicatorText = this.add.text(Number(width) / 2, Number(height) * 0.45, num.toString(), {
      ...FONT_CONFIG,
      fontSize: '48px',
    });
    const guideText = this.add.text(Number(width) / 2, Number(height) * 0.6, 'Use your mouse and keyboard to move your characters and avoid falling boxes!', {
      ...FONT_CONFIG,
      fontSize: '12px',
      wordWrap: { width: 225 },
      align: 'center',
    });

    indicatorText.setOrigin(0.5, 0.5);
    guideText.setOrigin(0.5, 0.5);

    this.sound.play('tick');

    const startEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callbackScope: this,
      callback: () => {
        num--;

        if (isNaN(Number(indicatorText.text))) {
          indicatorText.destroy();

          this.state.startGame();
          this.setCollision();
          this.player.listenInputs();

          this.boxes.add(Box.createRandomBox(this));
    
          startEvent.destroy();

          return;
        }

        if (num > 0) {
          indicatorText.setText(num.toString());
        } else {
          indicatorText.setText('GO!');
          guideText.destroy();
        }

        this.sound.play('tick');
      },
    });
  }

  private setCollision() {
    this.physics.add.collider(this.player, this.boxes, () => {
      this.player.die();
      this.player.disableInputs();
    });
  }

  private initState(): GameState {
    const originalState = new GameState();
  
    const scoreProxy = new Proxy(originalState, {
      set: (target: GameState, key: string, value: any) => {
        // @ts-ignore
        target[key] = value;

        if (key === 'score') {
          this.setScore(value);
        }

        return true;
      },
    });

    return scoreProxy;
  }

  public update(_: number, delta: number) {
    this.bgTexture.tilePositionY += 0.25;

    if (!this.state.isRunning) {
      return;
    }

    this.player.update();

    this.boxes.children.each((child: Phaser.GameObjects.GameObject) => {
      if (!child.active) {
        this.sound.play('break');
        this.boxes.killAndHide(child);
        this.boxes.remove(child);

        if (!this.player.isDead) {
          this.state.incrementScore();
        }
      }
    });

    let upperBound = '0';
    const keys = Object.keys(GameScene.spawnTime);

    for (let i = 0; i < keys.length; i++) {
      if (this.state.score >= Number(keys[i])) {
        upperBound = keys[i];
      } else {
        break;
      }
    }

    if (Number(upperBound) !== this.difficulty) {
      this.sound.play('difficulty');
      this.difficulty = Number(upperBound);
    }

    this.spawnTime += delta;

    if (this.spawnTime >= GameScene.spawnTime[upperBound]) {
      this.spawnTime = 0;
      this.boxes.add(Box.createRandomBox(this));
    }
  }

  private setScore(value: number) {
    this.scoreText.setText(`SCORE: ${value.toString().padStart(5, '0')}`);
  }

  private showResultScene() {
    const storage = GameStorage.getInstance();
    const isRecord = storage.highScore < this.state.score;

    if (isRecord) {
      this.highScoreText.setText(`HI: ${this.state.score.toString().padStart(5, '0')}`);
      storage.setHighScore(this.state.score);
    }
  
    this.scene.launch(
      'ResultScene',
      {
        state: this.state,
        isRecord,
      },
    );
  }

  public restart() {
    this.cleanup();

    this.startGame();
  }

  private cleanup() {
    this.state = this.initState();
    this.player.revive();
    this.input.setDefaultCursor('default');

    this.boxes.children.each((child: Phaser.GameObjects.GameObject) => {
      this.boxes.remove(child);

      child.setActive(false);
      child.destroy();
    });
  }
}
