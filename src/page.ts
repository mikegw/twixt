import { display, GlobalContext, hide, UIElement } from "./index";
import { User } from "./user";
import { GetStarted } from "./pages/getStarted";
import { MainMenu } from "./pages/mainMenu";
import { JoinOrStart } from "./pages/joinOrStart";
import { PlayGame } from "./pages/playGame";

type NavigationButton = UIElement & {
  nextPage: PageName
}

const isNavigationButton = (button: Button): button is NavigationButton => "nextPage" in button;

export type ActionButton = UIElement & {
  type: 'Action'
}

type Button = NavigationButton | ActionButton


export type Page = UIElement & {
  navigation: Button[]
  setup: () => void
}

const pageNames = ['GetStarted', 'MainMenu', 'JoinOrStart', 'PlayGame'] as const
export type PageName = typeof pageNames[number]

export const Pages: Record<PageName, Page> = {
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
    navigation: [
      { id: 'back-to-main-menu', nextPage: 'MainMenu' }
    ],
    setup: JoinOrStart
  },
  PlayGame: {
    id: 'play-game',
    navigation: [
      { id: 'back-to-join-or-start', nextPage: 'JoinOrStart' }
    ],
    setup: PlayGame
  }
}

export const navigateTo = (page: Page) => {
  for (let otherPage of Object.values(Pages)) hide(otherPage)

  GlobalContext.currentPage = page

  page.setup()
  display(page)
}

const addNavigation = (button: NavigationButton) => {
  const nextPage = Pages[button.nextPage]
  const buttonHTMLElement = document.getElementById(button.id)

  buttonHTMLElement.addEventListener('click', (e) => {
    e.preventDefault()
    navigateTo(nextPage)
  })
}

export const setupPages = () => {
  for (let page of Object.values(Pages) ) {
    const navigationButtons = page.navigation.filter(isNavigationButton)
    for (let button of navigationButtons) addNavigation(button)
  }
}
