import { Position } from "./board";
import { DataStore } from "../dataStore";

function isPosition(data: object): data is Position {
  return 'row' in data && 'column' in data
}

export class GameData {
  id: string
  dataStore: DataStore

  get gamePath() {
    return `games/${this.id}`
  }

  get movesPath(): string {
    return this.gamePath + '/moves'
  }

  get firstPlayerPath(): string {
    return this.gamePath + '/firstPlayer'
  }

  constructor(dataStore: DataStore, id?: string) {
    this.dataStore = dataStore
    this.id = id || GameData.generateGameId()
  }

  subscribe(callback: (position: Position) => void){
    this.dataStore.onChildAdded(this.movesPath, (data) => {
      if (isPosition(data)) callback(data)
    })
  }

  write(position: Position) {
    this.dataStore.append(this.movesPath, position)
  }

  setFirstPlayer(name: string) {
    this.dataStore.write(this.firstPlayerPath, name)
  }

  getFirstPlayer(callback: (name: string) => void) {
    this.dataStore.read(this.firstPlayerPath, callback)
  }

  static generateGameId() {
    // https://stackoverflow.com/a/6248722
    const firstPart = (Math.random() * 46656) | 0;
    const secondPart = (Math.random() * 46656) | 0;
    const firstPartString = ("000" + firstPart.toString(36)).slice(-3);
    const secondPartString = ("000" + secondPart.toString(36)).slice(-3);

    return firstPartString + secondPartString;
  }
}
