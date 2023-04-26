import { navigateTo, Page, PageName, Pages, setupPages } from "./page";
import { User } from "./user";
import { FirebaseOptions } from "firebase/app";
import { dataStore } from "./dataStore/firebase";
import { DataStore } from "./dataStore";

export type Environment = 'local' | 'test' | 'production'

export type Config = { firebaseConfig: FirebaseOptions, environment: Environment }

// @ts-ignore
const config: Config = CONFIG

export type UIElement = { id: string }

export const display = (element: UIElement) => {
  document.getElementById(element.id).classList.remove('hidden')
}

export const hide = (element: UIElement) => {
  document.getElementById(element.id).classList.add('hidden')
}

export type GlobalContextType = {
  gameInProgressKey: string;
  gameId: string
  currentUser: User
  currentPage: Page
  dataStore: DataStore
}

export const GlobalContext: GlobalContextType = {
  currentPage: Pages.GetStarted,
  currentUser: null,
  gameId: null,
  gameInProgressKey: null,
  dataStore: dataStore(config)
}

setupPages()

navigateTo(Pages.GetStarted)
