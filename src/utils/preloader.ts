import Phaser from 'phaser';

export function preload(scene: Phaser.Scene): void {
  scene.load.image('background', 'bg-pattern.png');
  scene.load.spritesheet('terrain', 'terrain.png', {
    frameWidth: 16, frameHeight: 16,
  });

  scene.load.spritesheet('chara', 'chara.png', {
    frameWidth: 32, frameHeight: 32,
  });
  
  scene.load.spritesheet('chara-run', 'chara-run.png', {
    frameWidth: 32, frameHeight: 32,
  });

  scene.load.image('box-1', 'box-1.png');
  scene.load.spritesheet('box-1-break', 'box-1-break', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-2', 'box-2.png');
  scene.load.spritesheet('box-2-break', 'box-2-break', {
    frameWidth: 24, frameHeight: 24,
  });

  scene.load.image('box-3', 'box-3.png');
  scene.load.spritesheet('box-3-break', 'box-3-break', {
    frameWidth: 24, frameHeight: 24,
  });
}
