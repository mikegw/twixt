import { navigateTo, Page, PageName, setupPages } from "./page";
import { User } from "./user";
import { GetStarted } from "./pages/getStarted";
import { MainMenu } from "./pages/mainMenu";
import { JoinOrStart } from "./pages/joinOrStart";
import { PlayGame } from "./pages/playGame";
import * as firebase from "./dataStore/firebase";
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

const pages: Record<PageName, Page> = {
  GetStarted: {
    id: 'get-started',
    navigation: [
      { id: 'get-started-button', nextPage: 'MainMenu' }
    ],
    setup: GetStarted
  },
  MainMenu:  {
    id: 'main-menu',
    navigation: [
      { id: 'play', nextPage: 'JoinOrStart' }
    ],
    setup: MainMenu
  },
  JoinOrStart: {
    id: 'join-or-start-game',
    navigation: [],
    setup: JoinOrStart
  },
  PlayGame: {
    id: 'play-game',
    navigation: [],
    setup: PlayGame
  }
}

export type GlobalContextType = {
  currentUser: User
  pages: Record<PageName, Page>,
  gameId: string
  dataStore: DataStore
}

export const GlobalContext: GlobalContextType = {
  pages,
  currentUser: null,
  gameId: null,
  dataStore: dataStore(config)
}

setupPages()

navigateTo(pages.GetStarted)
