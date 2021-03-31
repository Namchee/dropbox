import { Game, AUTO } from 'phaser';

import { HomeScene } from './scenes/home';
import { GameScene } from './scenes/game';
import { ResultScene } from './scenes/result';

const config = {
  type: AUTO,
  width: 320,
  height: 480,
  background: 'transparent',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  parent: 'game',
  scene: [HomeScene, GameScene, ResultScene],
};

new Game(config);
