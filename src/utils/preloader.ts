import Phaser from 'phaser';

import WebFontFile from './font-loader';

export function preload(scene: Phaser.Scene): void {
  scene.load.image('background', '/dropbox/bg-pattern.png');
  scene.load.spritesheet('terrain', '/dropbox/terrain.png', {
    frameWidth: 16, frameHeight: 16,
  });

  scene.load.spritesheet('player', '/dropbox/player.png', {
    frameWidth: 32, frameHeight: 32,
  });
  scene.load.spritesheet('player-run', '/dropbox/player-run.png', {
    frameWidth: 32, frameHeight: 32,
  });
  scene.load.spritesheet('player-die', '/dropbox/fx/die.png', {
    frameWidth: 96, frameHeight: 96,
  });

  scene.load.image('box-1', '/dropbox/box-1.png');
  scene.load.spritesheet('box-1-break', '/dropbox/fx/box-1-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-2', '/dropbox/box-2.png');
  scene.load.spritesheet('box-2-break', '/dropbox/fx/box-2-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-3', '/dropbox/box-3.png');
  scene.load.spritesheet('box-3-break', '/dropbox/fx/box-3-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('smoke', '/dropbox/fx/smoke.png');

  scene.load.image('restart', '/dropbox/buttons/restart.png');
  scene.load.image('back', '/dropbox/buttons/back.png');
  scene.load.image('play', '/dropbox/buttons/play.png');

  scene.load.audio('tick', '/dropbox/sfx/tick.wav');
  scene.load.audio('break', '/dropbox/sfx/break.wav');
  scene.load.audio('die', '/dropbox/sfx/die.wav');
  scene.load.audio('button', '/dropbox/sfx/button.wav');

  scene.load.addFile(new WebFontFile(scene.load, 'Press Start 2P'));
}
