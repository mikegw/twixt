import { navigateTo, Page, PageName, Pages, setupPages } from "./page";
import { User } from "./user";
import { FirebaseOptions } from "firebase/app";
import { dataStore } from "./dataStore/firebase";
import { DataStore } from "./dataStore";
import { UsernameList } from "./usernameList";

export type Environment = 'local' | 'test' | 'production'

export type Config = { firebaseConfig: FirebaseOptions, environment: Environment }

// @ts-ignore
const config: Config = CONFIG

export type UIElement = { id: string }

function isHTMLElement(element: UIElement | HTMLElement): element is HTMLElement {
  return "innerHTML" in element
}

export const display = (element: UIElement | HTMLElement) => {
  let htmlElement =
    isHTMLElement(element) ? element : document.getElementById(element.id)

  htmlElement.classList.remove('hidden')
}

export const hide = (element: UIElement | HTMLElement) => {
  let htmlElement =
    isHTMLElement(element) ? element : document.getElementById(element.id)

  htmlElement.classList.add('hidden')
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

const USERNAME_STORAGE_KEY = 'twixt-username'
const logoutButton: HTMLButtonElement = document.querySelector('.log-out-button')
logoutButton.addEventListener('click', () => {
  GlobalContext.currentUser.unsubscribe()
  window.localStorage.removeItem(USERNAME_STORAGE_KEY)
  window.location.reload()
})

export const loginUser = (name: string) => {
  console.log('Logging in ', name)
  window.localStorage.setItem(USERNAME_STORAGE_KEY, name)

  GlobalContext.currentUser = new User({ name }, GlobalContext.dataStore)

  const usernames = new UsernameList(GlobalContext.dataStore)
  usernames.addUser(name)

  display(logoutButton)
}

setupPages()

const username = window.localStorage.getItem(USERNAME_STORAGE_KEY)

if (username != null) {
  console.log(username, "logged in")
  loginUser(username)
  navigateTo(Pages.MainMenu)
} else {
  navigateTo(Pages.GetStarted)
}


