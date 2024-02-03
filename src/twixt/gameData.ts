import {isPosition, Position} from "./board";
import {DataStore} from "../dataStore";
import {generateId} from "../generateId";

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
    this.id = id || generateId()
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
}
