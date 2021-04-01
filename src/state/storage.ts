export class GameStorage {
  private static instance: GameStorage | undefined;

  public static getInstance(): GameStorage {
    if (!GameStorage.instance) {
      GameStorage.instance = new GameStorage();
    }

    return GameStorage.instance;
  }

  public get highScore() {
    return Number(localStorage.getItem('high-score')) || 0;
  }

  public setHighScore(value: number) {
    localStorage.setItem('high-score', value.toString());
  }
}
