import Phaser from 'phaser';

import WebFontFile from './font-loader';

export function preload(scene: Phaser.Scene): void {
  scene.load.image('background', 'bg-pattern.png');
  scene.load.spritesheet('terrain', 'terrain.png', {
    frameWidth: 16, frameHeight: 16,
  });

  scene.load.spritesheet('player', 'player.png', {
    frameWidth: 32, frameHeight: 32,
  });
  scene.load.spritesheet('player-run', 'player-run.png', {
    frameWidth: 32, frameHeight: 32,
  });
  scene.load.spritesheet('player-die', 'fx/die.png', {
    frameWidth: 96, frameHeight: 96,
  });

  scene.load.image('box-1', 'box-1.png');
  scene.load.spritesheet('box-1-break', 'fx/box-1-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-2', 'box-2.png');
  scene.load.spritesheet('box-2-break', 'fx/box-2-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-3', 'box-3.png');
  scene.load.spritesheet('box-3-break', 'fx/box-3-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('smoke', 'fx/smoke.png');

  scene.load.image('restart', 'buttons/restart.png');
  scene.load.image('back', 'buttons/back.png');

  scene.load.addFile(new WebFontFile(scene.load, 'Press Start 2P'));
}
