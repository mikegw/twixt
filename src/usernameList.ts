import { dataStore } from "./dataStore/firebase"
import { DataStore } from "./dataStore";

export class UsernameList {
  dataStore
  unsubscribeCallbacks: (() => void)[] = []

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
    const unsubscribe = this.dataStore.onChildAdded(
      UsernameList.usernamesPath(),
      (_, name) => callback(name)
    )
    this.unsubscribeCallbacks.push(unsubscribe)
  }

  onUserRemoved(callback: (data: any, key: string) => void) {
    const unsubscribe = this.dataStore.onChildRemoved(UsernameList.usernamesPath(), callback)
    this.unsubscribeCallbacks.push(unsubscribe)
  }

  unsubscribe() {
    this.unsubscribeCallbacks.forEach(unsubscribe => unsubscribe())
  }
}
