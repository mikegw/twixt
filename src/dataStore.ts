export type Unsubscription = () => void
export type DataStore = {
  onChildAdded: (path: string, callback: (data: any, key: string) => void) => Unsubscription,
  onChildChanged: (path: string, callback: (data: any, key: string) => void) => Unsubscription,
  onChildRemoved: (path: string, callback: (data: any, key: string) => void) => Unsubscription,
  read: <T=any>(path: string, callback: (data: T, key: string) => void) => void
  append: (path: string, data: any) => void,
  write: (path: string, data: any) => void,
  destroy: (path: string) => Promise<void>
}

export type TestDataStore = DataStore & {
  clearEnvironment: () => Promise<void>
}
