import Phaser from 'phaser';

import { Player } from './../objects/player';
import { Box } from './../objects/box';

import { GameState } from '../state/game';

import { FONT_CONFIG } from './utils';

export class GameScene extends Phaser.Scene {
  private static readonly spawnTime: Record<string, number> = {
    0: 1000,
    50: 750,
    100: 500,
  };

  private background!: Phaser.GameObjects.TileSprite;
  private terrain!: Phaser.GameObjects.TileSprite;

  private player!: Player;
  private boxes!: Phaser.GameObjects.Group;

  private state!: GameState;

  private spawnTime!: number;

  public constructor() {
    super('GameScene');
  }

  public create() {
    const { width, height } = this.game.config;

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

    this.spawnTime = 0;

    this.state = new GameState();

    this.boxes.add(Box.createRandomBox(this));

    this.physics.add.collider(this.player, this.boxes, () => {
      this.player.die();
    });
  }

  public startGame() {
    this.state.startGame();
  }

  public update(_: number, delta: number) {
    this.boxes.children.each((child: Phaser.GameObjects.GameObject) => {
      if (!child.active && this.player) {
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
}
