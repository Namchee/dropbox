import Phaser from 'phaser';

import { Player } from './../objects/player';
import { Box } from './../objects/box';

import { GameState } from '../state/game';

import { FONT_CONFIG } from './utils';
import { GameStorage } from '../state/storage';

export class GameScene extends Phaser.Scene {
  private static readonly spawnTime: Record<string, number> = {
    0: 1000,
    25: 750,
    50: 500,
    100: 250,
  };

  private background!: Phaser.GameObjects.TileSprite;
  private terrain!: Phaser.GameObjects.TileSprite;

  private player!: Player;
  private boxes!: Phaser.GameObjects.Group;

  private scoreText!: Phaser.GameObjects.Text;
  private highScoreText!: Phaser.GameObjects.Text;

  private state!: GameState;

  private spawnTime!: number;

  public constructor() {
    super('GameScene');
  }

  public create() {
    const { width, height } = this.game.config;
  
    this.state = this.setState();

    this.background = this.add
      .tileSprite(0, 0, Number(width), Number(height), 'background')
      .setOrigin(0, 0);

    this.terrain = this.add
      .tileSprite(0, Number(height), Number(width), 16, 'terrain', 2)
      .setOrigin(0, 0.5);
    this.physics.world.setBounds(0, 0, Number(width), Number(height) - 8);

    this.boxes = this.add.group();

    this.player = Player.create(this);
    this.player.setDepth(1);
    this.player.setDieCallback(() => this.showResultScene());

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

    this.boxes.add(Box.createRandomBox(this));
    
    this.setCollision();
  }

  public startGame() {
    this.state.startGame();
  }

  private setCollision() {
    this.physics.add.collider(this.player, this.boxes, () => {
      this.player.die();
    });
  }

  private setState(): GameState {
    const originalState = new GameState();
  
    const scoreProxy = new Proxy(originalState, {
      set: (target: GameState, key: string, value: any) => {
        if (key === 'score') {
          target[key] = value;
          this.setScore(value);
        }

        return true;
      },
    });

    return scoreProxy;
  }

  public update(_: number, delta: number) {
    this.boxes.children.each((child: Phaser.GameObjects.GameObject) => {
      if (!child.active && !this.player.isDead) {
        this.state.incrementScore();
        this.boxes.killAndHide(child);
        this.boxes.remove(child);
      }
    });

    let upperBound = '0';
    const keys = Object.keys(GameScene.spawnTime);

    for (let i = 0; i < keys.length; i++) {
      if (this.state.score >= GameScene.spawnTime[keys[i]]) {
        upperBound = keys[i];
      } else {
        break;
      }
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
}
