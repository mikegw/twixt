import { display, GlobalContext, hide, UIElement } from "./index";
import Global = NodeJS.Global;

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

let activePage: Page

export const navigateTo = (page: Page) => {
  if(activePage) hide(activePage)
  activePage = page

  page.setup()
  display(page)
}

const addNavigation = (button: NavigationButton) => {
  const nextPage = GlobalContext.pages[button.nextPage]
  const buttonHTMLElement = document.getElementById(button.id)

  buttonHTMLElement.addEventListener('click', (e) => {
    e.preventDefault()
    navigateTo(nextPage)
  })
}

export const setupPages = () => {
  for (let pageName of pageNames ) {
    const page = GlobalContext.pages[pageName]

    const navigationButtons = page.navigation.filter(isNavigationButton)
    for (let button of navigationButtons) addNavigation(button)
  }
}
