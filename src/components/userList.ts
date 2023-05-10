import { GlobalContext } from "../index";
import { UsernameList } from "../usernameList";
import { UserRow } from "./userRow";

export class UserList {
  element
  usernames

  constructor(element: HTMLUListElement, usernames: UsernameList) {
    this.usernames = usernames
    this.element = element

    this.populate()
    this.addEventListeners()
  }

  clear(): Element[] {
    return Array.from(this.element.children).map(child => this.element.removeChild(child))
  }

  private populate() {
    this.usernames.onUserAdded((name: string) => {
      console.log(`populate ${name} for ${GlobalContext.currentUser.name}`)
      if (GlobalContext.currentUser.name == name) return

      const row = this.newRowElement(name)
      this.element.appendChild(row.element)
      this.sort()
    })

    this.usernames.onUserRemoved((_, name) => {
      const userLi = document.getElementById(`player-${name}`)

      if (userLi) userLi.remove()
    })
  }

  private addEventListeners = () => {
    const user = GlobalContext.currentUser
    user.onInviteReceived(this.receiveInvite)
    user.onGameInProgress(this.gameInProgress)
  }

  private receiveInvite = ({ name }: { name: string }, key: string) => {
    const userLi = document.getElementById(`player-${name}`)
    if(userLi) {
      userLi.setAttribute('invite', 'pending')
      userLi.setAttribute('invite-key', key)
    } else {
      setTimeout(() => this.receiveInvite({name}, key), 50)
    }
  }

  private gameInProgress = ({ gameId, opponent}: { gameId: string, opponent: string }, key: string) => {
    const userLi = document.getElementById(`player-${opponent}`)
    if (!userLi) {
      setTimeout(() => this.gameInProgress({ gameId, opponent }, key), 50)
      return
    }

    userLi.setAttribute('invite', 'accepted')
    userLi.setAttribute('game-id', gameId)
    userLi.setAttribute('game-in-progress-key', key)

    GlobalContext.currentUser.onGameCompleted(({gameId, opponent}, key) => {
      userLi.removeAttribute('invite')
      userLi.removeAttribute('invite-key')
      userLi.removeAttribute('game-id')
      userLi.removeAttribute('game-in-progress-key')
    })
  }

  private newRowElement(name: string) {
    return new UserRow({
      name,
      onInvite: () => GlobalContext.currentUser.invite({ name }),
      onAcceptInvite: (key: string) => {
        GlobalContext.currentUser.acceptInvite({ name }, key)
      }
    })
  }

  private sorting: boolean

  private sort() {
    this.sorting = true
    setTimeout(() =>{
      if (!this.sorting) return
      this.sorting = false
      console.log('Sorting')
      const items = this.clear()

      const orderedItems = items.sort(this.compare)

      for (let item of orderedItems) this.element.appendChild(item)
    }, 30)
  }

  private compare = (li1: HTMLLIElement, li2: HTMLLIElement): number => {
    return li1.textContent.toLocaleLowerCase().localeCompare(li2.textContent.toLocaleLowerCase())
  }
}
