import Phaser from 'phaser';

import WebFontFile from './font-loader';

export function preload(scene: Phaser.Scene): void {
  scene.load.image('background', '/bg-pattern.png');
  scene.load.spritesheet('terrain', '/terrain.png', {
    frameWidth: 16, frameHeight: 16,
  });

  scene.load.spritesheet('player', '/player.png', {
    frameWidth: 32, frameHeight: 32,
  });
  scene.load.spritesheet('player-run', '/player-run.png', {
    frameWidth: 32, frameHeight: 32,
  });
  scene.load.spritesheet('player-die', '/fx/die.png', {
    frameWidth: 96, frameHeight: 96,
  });

  scene.load.image('box-1', '/box-1.png');
  scene.load.spritesheet('box-1-break', '/fx/box-1-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-2', '/box-2.png');
  scene.load.spritesheet('box-2-break', '/fx/box-2-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-3', '/box-3.png');
  scene.load.spritesheet('box-3-break', '/fx/box-3-break.png', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('smoke', '/fx/smoke.png');

  scene.load.image('home', '/buttons/home.png');
  scene.load.image('home-pressed', '/buttons/home-pressed.png');
  scene.load.image('restart', '/buttons/restart.png');
  scene.load.image('restart-pressed', '/buttons/restart-pressed.png');
  scene.load.image('play', '/buttons/play.png');
  scene.load.image('play-pressed', '/buttons/play-pressed.png');
  scene.load.image('volume-on', '/buttons/volume-on.png');
  scene.load.image('volume-off', '/buttons/volume-off.png');

  scene.load.audio('tick', '/sfx/tick.wav');
  scene.load.audio('break', '/sfx/break.wav');
  scene.load.audio('die', '/sfx/die.wav');
  scene.load.audio('button', '/sfx/button.wav');

  scene.load.addFile(new WebFontFile(scene.load, 'Press Start 2P'));
}
