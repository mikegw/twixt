import { subscribe, writeData } from "./sync";

export class GameData {
  gameId: string

  get gamePath() {
    return `games/${this.gameId}`
  }

  constructor(gameId?: string) {
    this.gameId = gameId || this.generateGameId()
  }

  subscribe(callback: (data: object) => void){
    subscribe(this.gamePath, callback)
  }

  writeData(data: object) {
    writeData(this.gamePath, data)
  }

  generateGameId() {
    // https://stackoverflow.com/a/6248722
    const firstPart = (Math.random() * 46656) | 0;
    const secondPart = (Math.random() * 46656) | 0;
    const firstPartString = ("000" + firstPart.toString(36)).slice(-3);
    const secondPartString = ("000" + secondPart.toString(36)).slice(-3);

    return firstPartString + secondPartString;
  }
}
