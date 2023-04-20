import { GlobalContext } from "../index";
import { User } from "../user";
import { dataStore } from "../dataStore/firebase";
import { UsernameList } from "../usernameList";

export function GetStarted() {
  const getStartedButton: HTMLButtonElement = document.querySelector('#get-started-button')
  const usernameInput: HTMLInputElement = document.querySelector('input[name="username"]')

  getStartedButton.addEventListener('click', (e) => {
    e.preventDefault()

    const username = usernameInput.value
    GlobalContext.currentUser = new User({ name: username }, GlobalContext.dataStore)

    const usernames = new UsernameList(GlobalContext.dataStore)
    usernames.addUser(username)
  })
}

