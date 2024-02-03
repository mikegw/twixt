export type Unsubscription = () => void
export type Callback<T=any> = (data: T, key: string) => void

export type CallbackType = 'childAdded' | 'childChanged' | 'childRemoved'
export type CallbackWithType = { type: CallbackType, callback: Callback }

export type DataStore = {
  onChildAdded: (path: string, callback: Callback) => Unsubscription,
  onChildChanged: (path: string, callback: Callback) => Unsubscription,
  onChildRemoved: (path: string, callback: Callback) => Unsubscription,
  read: <T=any>(path: string, callback: Callback<T>) => void
  append: (path: string, data: any) => void,
  write: (path: string, data: any) => void,
  destroy: (path: string) => Promise<void>
}

export type TestDataStore = DataStore & {
  clearEnvironment: () => Promise<void>
}
