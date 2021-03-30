export class MainState {
  private static instance: MainState;

  private isRunning: boolean;
  private score: number;

  private constructor() {
    this.isRunning = false;
    this.score = 0;
  }

  public static getInstance() {
    if (MainState.instance) {
      MainState.instance = new MainState();
    }

    return MainState.instance;
  }

  public startGame(): void {
    this.isRunning = true;
  }

  public stopGame(): void {
    this.isRunning = false;
  }

  public setScore(value: number): void {
    this.score = value;
  }
}
