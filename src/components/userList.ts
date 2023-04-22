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
  private populate() {
    this.usernames.onUserAdded((name: string) => {
      if (GlobalContext.currentUser.name == name) return

      const row = this.newRowElement(name)
      this.element.appendChild(row.element)
    })

    this.usernames.onUserRemoved(name => {
      const userLi = document.getElementById(`player-${name}`)
      userLi.remove()
    })
  }

  private addEventListeners = () => {
    GlobalContext.currentUser.onInviteReceived(({ name }, key) => {
      const userLi = document.getElementById(`player-${name}`)
      userLi.setAttribute('invite', 'pending')
      userLi.setAttribute('invite-key', key)
    })

    GlobalContext.currentUser.onGameInProgress(({ gameId, opponent}, key) => {
      const userLi = document.getElementById(`player-${opponent}`)
      userLi.setAttribute('invite', 'accepted')
      userLi.setAttribute('game-id', gameId)
      userLi.setAttribute('game-in-progress-key', key)
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
}