import Phaser from 'phaser';
import WebFontLoader from 'webfontloader';

export default class WebFontFile extends Phaser.Loader.File {
  public readonly fontNames: string | string[];
  private readonly service: string;

	/**
	 * @param {Phaser.Loader.LoaderPlugin} loader
	 * @param {string | string[]} fontNames
	 * @param {string} [service]
	 */
	public constructor(
    loader: Phaser.Loader.LoaderPlugin,
    fontNames: string | string[],
    service: string = 'google'
  ) {
		super(loader, {
			type: 'webfont',
			key: fontNames.toString()
		})

		this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames]
		this.service = service;
	}

	public load() {
		const config: Record<string, any> = {
			active: () => {
				this.loader.nextFile(this, true)
			}
		}

		switch (this.service) {
			case 'google': {
        config['google'] = {
					families: this.fontNames
				};

				break;
      }
      default: {
        throw new Error('Unsupported font service');
      }
		}
		
		WebFontLoader.load(config);
	}
}
