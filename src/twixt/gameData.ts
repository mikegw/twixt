import {isPosition, Position} from "./board";
import {DataStore} from "../dataStore";
import {generateId} from "../generateId";
import { Action } from "./action";

export class GameData {
  id: string
  dataStore: DataStore

  get gamePath() {
    return `games/${this.id}`
  }

  get actionsPath(): string {
    return this.gamePath + '/actions'
  }

  get firstPlayerPath(): string {
    return this.gamePath + '/firstPlayer'
  }

  constructor(dataStore: DataStore, id?: string) {
    this.dataStore = dataStore
    this.id = id || generateId()
  }

  subscribe(callback: (action: Action) => void){
    this.dataStore.onChildAdded(this.actionsPath, callback)
  }

  write(action: Action) {
    this.dataStore.append(this.actionsPath, action)
  }

  setFirstPlayer(name: string) {
    this.dataStore.write(this.firstPlayerPath, name)
  }

  getFirstPlayer(callback: (name: string) => void) {
    this.dataStore.read(this.firstPlayerPath, callback)
  }
}
