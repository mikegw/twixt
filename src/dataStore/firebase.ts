import { FirebaseApp } from "firebase/app";
import { getDatabase, ref, push, get, set, remove, onChildAdded, onChildChanged, onChildRemoved, DatabaseReference, Database } from "firebase/database"
import { DataStore, TestDataStore } from "../dataStore"
import { Config, Environment } from "../index";

let environment: Environment = 'local'

const newDataStore = (environment: string, db: Database): DataStore => {
  const reference = (path: string): DatabaseReference => {
    return ref(db, [environment, path].join('/'))
  }

  const read = <T=any>(path: string, callback: (data: T, key: string) => void) => {
    get(reference(path)).then(snapshot => callback(snapshot.val(), snapshot.key))
  }

  const write = (path: string, data: any) => {
    set(reference(path), data)
  }

  const append = (path: string, data: any) => {
    push(reference(path), data).catch(reason => console.log(reason))
  }

  const childAdded = (path: string, callback: (data: any, key: string) => void) => {
    return onChildAdded(reference(path), snapshot => {
      callback(snapshot.val(), snapshot.key)
    })
  }

  const childChanged = (path: string, callback: (data: any, key: string) => void) => {
    return onChildChanged(reference(path), snapshot => callback(snapshot.val(), snapshot.key))
  }

  const childRemoved = (path: string, callback: (data: any, key: string) => void) => {
    return onChildRemoved(reference(path), snapshot => callback(snapshot.key, snapshot.val()))
  }

  const destroy = (path: string) => {
    return remove(reference(path))
  }

  return {
    read,
    write,
    append,
    destroy,
    onChildAdded: childAdded,
    onChildChanged: childChanged,
    onChildRemoved: childRemoved
  }
}

const newSandboxDataStore = (environmentName: string, db: Database): TestDataStore => {
  const clearEnvironment = () => {
    return remove(ref(db, environmentName))
  }

  return { ...newDataStore(environmentName, db), clearEnvironment }
}

export const dataStore = (app: FirebaseApp, config: Config) => {
  environment = config.environment
  const db = getDatabase(app)

  switch(environment) {
    case 'test':
    case 'e2e':
      return newSandboxDataStore('test', db)
    case 'production':
      return  newDataStore('production', db)
    default:
      return newSandboxDataStore('local', db)
  }
}
