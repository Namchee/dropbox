import Phaser from 'phaser';

import WebFontFile from '../utils/font-loader';

export class PreloaderScene extends Phaser.Scene {
  public constructor() {
    super('PreloaderScene');
  }

  public preload() {
    this.initPreloader();
    this.loadAssets();
  }

  private initPreloader() {
    const { width, height } = this.cameras.main;

    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();

    progressBox.fillStyle(0x313131, 0.8);
    progressBox.fillRect(width / 7, 220, width * 0.75, 40);

    const loadingText = this.add.text(
      Number(width) / 2,
      Number(height) / 2 - 50,
      'Loading...',
      {
        fontFamily: 'Courier New',
        fontSize: '20px',
      },
    );

    loadingText.setOrigin(0.5, 0.5);

    const percentText = this.add.text(
      Number(width) / 2,
      Number(height) / 2,
      '0%',
      {
        fontFamily: 'Courier New',
        fontSize: '16px',
      },
    );

    percentText.setOrigin(0.5, 0.5);

    const assetText = this.add.text(
      Number(width) / 2,
      Number(height) / 2 + 50,
      '',
      {
        fontFamily: 'Courier New',
        fontSize: '12px',
      },
    );

    assetText.setOrigin(0.5, 0.5);

    this.load.on('progress', (value: string) => {
      percentText.setText(`${(Number(value) * 100).toFixed(2)}%`);
      progressBar.clear();
      progressBar.fillStyle(0xF4F4F5, 0.25);
      progressBar.fillRect(width / 6, 227.5, Number(value) * width * 0.7, 25);
    });

    this.load.on('fileprogress', (file: Phaser.Loader.File) => {
      assetText.setText('Loading asset: ' + file.key);
    });

    this.load.on('complete', () => {
      this.tweens.add({
        targets: [progressBar, progressBox, loadingText, percentText, assetText],
        alpha: 0,
        duration: 350,
        onComplete: () => {
          progressBar.destroy();
          progressBox.destroy();
          loadingText.destroy();
          percentText.destroy();
          assetText.destroy();

          this.scene.sendToBack();

          this.scene.start('HomeScene');
        },
      });
    });
  }

  private loadAssets() {
    this.load.image('background', '/bg-pattern.png');
    this.load.spritesheet('terrain', '/terrain.png', {
      frameWidth: 16, frameHeight: 16,
    });

    this.load.spritesheet('player', '/player.png', {
      frameWidth: 32, frameHeight: 32,
    });
    this.load.spritesheet('player-run', '/player-run.png', {
      frameWidth: 32, frameHeight: 32,
    });
    this.load.spritesheet('player-die', '/fx/die.png', {
      frameWidth: 96, frameHeight: 96,
    });

    this.load.image('box-1', '/box-1.png');
    this.load.spritesheet('box-1-break', '/fx/box-1-break.png', {
      frameWidth: 24, frameHeight: 24,
    });

    this.load.image('box-2', '/box-2.png');
    this.load.spritesheet('box-2-break', '/fx/box-2-break.png', {
      frameWidth: 24, frameHeight: 24,
    });

    this.load.image('box-3', '/box-3.png');
    this.load.spritesheet('box-3-break', '/fx/box-3-break.png', {
      frameWidth: 24, frameHeight: 24,
    });

    this.load.image('smoke', '/fx/smoke.png');

    this.load.image('home', '/buttons/home.png');
    this.load.image('home-pressed', '/buttons/home-pressed.png');
    this.load.image('restart', '/buttons/restart.png');
    this.load.image('restart-pressed', '/buttons/restart-pressed.png');
    this.load.image('play', '/buttons/play.png');
    this.load.image('play-pressed', '/buttons/play-pressed.png');
    this.load.image('volume-on', '/buttons/volume-on.png');
    this.load.image('volume-off', '/buttons/volume-off.png');

    this.load.audio('tick', '/sfx/tick.wav');
    this.load.audio('break', '/sfx/break.wav');
    this.load.audio('die', '/sfx/die.wav');
    this.load.audio('button', '/sfx/button.wav');
    this.load.audio('difficulty', '/sfx/difficulty.wav');

    this.load.addFile(
      new WebFontFile(this.load, 'Press Start 2P'),
    );
  }
}
