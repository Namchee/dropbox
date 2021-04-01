export class GameState {
  private _isRunning: boolean;
  private _score: number;

  public constructor() {
    this._isRunning = false;
    this._score = 0;
  }

  public get isRunning() {
    return this._isRunning;
  }

  public get score() {
    return this._score;
  }

  public set score(value: number) {
    this._score = value;
  }
  
  public startGame(): void {
    this._isRunning = true;
  }

  public stopGame(): void {
    this._isRunning = false;
  }

  public incrementScore(): void {
    this.score = this.score + 1;
  }
}
