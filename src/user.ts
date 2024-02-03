import { GameData } from "./twixt/gameData";
import { DataStore } from "./dataStore";
import { Coin } from "./coin";

export type Invite = {
  name: string
}

export type GameInProgress = {
  gameId: string,
  opponent: string
}
export class User {
  name
  dataStore
  unsubscribeCallbacks: (() => void)[] = []

  constructor(userData: { name: string }, dataStore: DataStore) {
    this.name = userData.name
    this.dataStore = dataStore
  }

  static userPath(name: string): string {
    return `users/${name}`
  }

  static invitesPath(user: string): string {
    return this.userPath(user) + `/invites`
  }

  static invitePath(user: string, key: string): string {
    return this.invitesPath(user) + `/${key}`
  }

  static gamesInProgressPath(user: string): string {
    return this.userPath(user) + `/gamesInProgress`
  }

  static gameInProgressPath(user: string, key: string): string {
    return this.gamesInProgressPath(user) + `/${key}`
  }

  get userPath(): string {
    return User.userPath(this.name)
  }

  invite(user: { name: string }) {
    this.dataStore.append(User.invitesPath(user.name), { name: this.name })
  }

  onInviteReceived(callback: (invite: Invite, key: string) => void) {
    const unsubscribe = this.dataStore.onChildAdded(User.invitesPath(this.name), callback)
    this.unsubscribeCallbacks.push(unsubscribe)
  }

  acceptInvite(invite: Invite, key: string) {
    this.dataStore.destroy(User.invitePath(this.name, key))

    const game = new GameData(this.dataStore)

    game.setFirstPlayer(Coin.toss() === Coin.Heads ? this.name : invite.name)

    this.dataStore.append(User.gamesInProgressPath(this.name),  { gameId: game.id, opponent: invite.name })
    this.dataStore.append(User.gamesInProgressPath(invite.name),  { gameId: game.id, opponent: this.name })
  }

  onGameInProgress(callback: (gameInProgress: GameInProgress, key: string) => void) {
    const unsubscribe = this.dataStore.onChildAdded(User.gamesInProgressPath(this.name), callback)
    this.unsubscribeCallbacks.push(unsubscribe)
  }

  completeGame(key: string) {
    this.dataStore.destroy(User.gameInProgressPath(this.name, key))
  }

  onGameCompleted(callback: (gameInProgress: GameInProgress, key: string) => void) {
    const unsubscribe = this.dataStore.onChildRemoved(User.gamesInProgressPath(this.name), callback)
    this.unsubscribeCallbacks.push(unsubscribe)
  }

  unsubscribe() {
    this.unsubscribeCallbacks.forEach(unsubscribe => unsubscribe())
  }
}
