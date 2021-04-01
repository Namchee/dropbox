import Phaser from 'phaser';

import { Player } from './../objects/player';
import { Box } from './../objects/box';

import { FONT_CONFIG } from './utils';

export class GameScene extends Phaser.Scene {
  private background!: Phaser.GameObjects.TileSprite;
  private terrain!: Phaser.GameObjects.TileSprite;

  private player!: Player;
  private boxes!: Phaser.GameObjects.Group;

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
    Box.createRandomBox(this);

    // this.player = Player.create(this);
    // this.boxes.add();
  }
}
