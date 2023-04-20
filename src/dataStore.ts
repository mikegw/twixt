export type DataStore = {
  onChildAdded: (path: string, callback: (data: any, key: string) => void) => void,
  onChildChanged: (path: string, callback: (data: any, key: string) => void) => void,
  onChildRemoved: (path: string, callback: (key: string) => void) => void,
  read: (path: string, callback: (data: any, key: string) => void) => void
  append: (path: string, data: any) => void,
  write: (path: string, data: any) => void,
  destroy: (path: string) => void
}

export type TestDataStore = DataStore & {
  clearEnvironment: () => void
}
