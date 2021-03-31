import Phaser from 'phaser';

import { preload } from './../utils/preloader';

export class HomeScene extends Phaser.Scene {
  public constructor() {
    super('HomeScene');
  }

  public preload() {
    preload(this);
  }

  create() {
    this.scene.launch('GameScene');
  }
}
