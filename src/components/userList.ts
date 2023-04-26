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

    this.usernames.onUserRemoved((_, name) => {
      const userLi = document.getElementById(`player-${name}`)
      userLi.remove()
    })
  }

  private addEventListeners = () => {
    const user = GlobalContext.currentUser
    user.onInviteReceived(({ name }, key) => {
      const userLi = document.getElementById(`player-${name}`)
      userLi.setAttribute('invite', 'pending')
      userLi.setAttribute('invite-key', key)
    })

    user.onGameInProgress(({ gameId, opponent}, key) => {
      const userLi = document.getElementById(`player-${opponent}`)
      userLi.setAttribute('invite', 'accepted')
      userLi.setAttribute('game-id', gameId)
      userLi.setAttribute('game-in-progress-key', key)

      GlobalContext.currentUser.onGameCompleted(({gameId, opponent}, key) => {
        userLi.removeAttribute('invite')
        userLi.removeAttribute('game-id')
        userLi.removeAttribute('game-in-progress-key')
      })
    })
  }

  private newRowElement(name: string) {
    return new UserRow({
      name,
      onInvite: () => GlobalContext.currentUser.invite({ name }),
      onAcceptInvite: (key: string) => {
        console.log('INVITE ACCEPTED')
        GlobalContext.currentUser.acceptInvite({ name }, key)
      }
    })
  }
}
