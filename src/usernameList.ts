import { dataStore } from "./dataStore/firebase"
import { DataStore } from "./dataStore";

export class UsernameList {
  dataStore

  constructor(dataStore: DataStore) {
    this.dataStore = dataStore
  }
  static usernamesPath(): string {
    return `userNames`
  }

  static usernamePath(name: string): string {
    return UsernameList.usernamesPath() + `/${name}`
  }
  
  addUser(name: string) {
    this.dataStore.write(UsernameList.usernamePath(name), true)
  }

  onUserAdded(callback: (name: string) => void) {
    this.dataStore.onChildAdded(
      UsernameList.usernamesPath(),
      (_, name) => callback(name)
    )
  }

  onUserRemoved(callback: (data: any, key: string) => void) {
    this.dataStore.onChildRemoved(UsernameList.usernamesPath(), callback)
  }
}
