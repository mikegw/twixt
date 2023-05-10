import { display, GlobalContext, loginUser } from "../index";
import { User } from "../user";
import { UsernameList } from "../usernameList";
import { navigateTo, Pages } from "../page";

export function GetStarted() {
  const getStartedForm: HTMLButtonElement = document.querySelector('#get-started')
  const usernameInput: HTMLInputElement = document.querySelector('input[name="username"]')

  getStartedForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const username = usernameInput.value
    const usernames = new UsernameList(GlobalContext.dataStore)
    usernames.addUser(username)

    loginUser(username)
    navigateTo(Pages.MainMenu)

    usernameInput.value = ""
  })
}

